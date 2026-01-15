const Game = require('../models/Game');
const Board = require('../models/Board');
const User = require('../models/User');
const Claim = require('../models/Claim');
const { generateCard } = require('../utils/cards');
const { validate } = require('../utils/bingoValidation');
const mongoose = require('mongoose');

class GameService {
  constructor(io) {
    this.io = io;
    this.timers = new Map(); // gameId -> interval/timer
  }

  async createGame({ name, createdBy, config = {} }) {
    const game = new Game({
      name,
      createdBy,
      cardConfig: config.cardConfig || { size: 5, freeCenter: true },
      numberPoolStart: config.numberPoolStart || 1,
      numberPoolEnd: config.numberPoolEnd || 75,
      patternsAllowed: config.patternsAllowed || ['row','column','diag','fullhouse'],
      stake: config.stake || 10
    });
    await game.save();
    return game;
  }

  async addPlayerAndBoard(gameId, userData) {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');
    const user = new User(userData);
    await user.save();
    const grid = generateCard({
      size: game.cardConfig.size,
      freeCenter: game.cardConfig.freeCenter,
      poolStart: game.numberPoolStart,
      poolEnd: game.numberPoolEnd
    });
    const board = new Board({
      gameId: game._id,
      owner: user._id,
      boardNumber: Math.floor(Math.random()*100000),
      grid
    });
    await board.save();
    game.players.push(user._id);
    game.boards.push(board._id);
    await game.save();
    return { user, board };
  }

  async callNext(gameId) {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');
    const called = new Set(game.calls || []);
    const pool = [];
    for (let i = game.numberPoolStart; i <= game.numberPoolEnd; i++) if (!called.has(i)) pool.push(i);
    if (pool.length === 0) throw new Error('No numbers remaining');
    const pick = pool[Math.floor(Math.random() * pool.length)];
    game.calls.push(pick);
    if (game.status === 'waiting') game.status = 'started';
    await game.save();
    this.io.to(String(game._id)).emit('call', { pick, calls: game.calls });
    return pick;
  }

  // Atomic bingo claim
  async claimBingo({ gameId, boardId, userId }) {
    const game = await Game.findById(gameId).lean();
    if (!game) throw new Error('game not found');
    const board = await Board.findById(boardId).lean();
    if (!board) throw new Error('board not found');

    const validation = validate(board.grid, game.calls, game.patternsAllowed);
    if (!validation.valid) {
      // store unsuccessful claim for audit
      const claim = new Claim({ gameId, boardId, owner: userId, callIndex: game.calls.length, pattern: null, verified: false });
      await claim.save();
      return { ok:false, reason: 'invalid' };
    }

    // Attempt atomic update: set status to ended if not already ended
    const updated = await Game.findOneAndUpdate(
      { _id: gameId, status: { $in: ['started','waiting'] } },
      { $set: { status: 'ended' } },
      { new: true }
    );
    if (!updated) {
      return { ok:false, reason:'already-ended' };
    }

    const claim = new Claim({
      gameId,
      boardId,
      owner: userId,
      callIndex: game.calls.length,
      pattern: validation.pattern,
      verified: true
    });
    await claim.save();

    // broadcast winner
    this.io.to(String(gameId)).emit('winner', { boardId, owner: userId, pattern: validation.pattern });

    // stop any auto-caller
    this.stopAutoCaller(String(gameId));

    return { ok:true, pattern: validation.pattern };
  }

  startAutoCaller(gameId, intervalMs) {
    if (this.timers.has(String(gameId))) return; // already running
    const timer = setInterval(async () => {
      try {
        await this.callNext(gameId);
      } catch (e) {
        // if no more numbers, stop
        if (e.message.includes('No numbers')) this.stopAutoCaller(gameId);
      }
    }, intervalMs);
    this.timers.set(String(gameId), timer);
  }

  stopAutoCaller(gameId) {
    const t = this.timers.get(String(gameId));
    if (t) {
      clearInterval(t);
      this.timers.delete(String(gameId));
    }
  }
}

module.exports = GameService;
