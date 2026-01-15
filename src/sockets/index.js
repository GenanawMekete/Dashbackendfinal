const { Server } = require('socket.io');
const state = require('../engine/gameState');
const draw = require('../engine/drawEngine');
const win = require('../engine/winChecker');
const { generateCards } = require('../engine/cardGenerator');
const { refundAllPlayers } = require('../services/refundService');
const { DRAW_INTERVAL } = require('../config/gameConfig');

module.exports = (server) => {
  const io = new Server(server, { cors: { origin: '*' } });

  function startLobby() {
    state.phase = 'LOBBY';
    state.players = {};
    state.calledNumbers = [];
    state.cards = generateCards();
    state.timer = 30;
    state.roundId = Date.now();

    io.emit('round:reset', { timer: state.timer, roundId: state.roundId, cards: state.cards });

    const lobbyTimer = setInterval(() => {
      state.timer--;
      io.emit('lobby:update', state.timer);
      if (state.timer <= 0) {
        clearInterval(lobbyTimer);
        startGame();
      }
    }, 1000);
  }

  async function startGame() {
    if (Object.keys(state.players).length === 0) {
      console.log('No players joined. Auto-refund triggered.');
      await refundAllPlayers(state.players);
      return startLobby();
    }

    state.phase = 'PLAY';
    io.emit('game:start');

    const drawTimer = setInterval(() => io.emit('number:draw', draw(state)), DRAW_INTERVAL);

    io.on('connection', socket => {
      socket.on('bingo:claim', ({ telegramId }) => {
        const p = state.players[telegramId];
        if (p && win(p.card, state.calledNumbers)) {
          io.emit('game:winner', telegramId);
          clearInterval(drawTimer);
          setTimeout(startLobby, 5000);
        }
      });
    });
  }

  startLobby();
};
