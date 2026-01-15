const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Board = require('../models/Board');

router.post('/create', async (req,res) => {
  try {
    const { name, user } = req.body; // minimal create
    const gs = req.app.get('gameService');
    const game = await gs.createGame({ name, createdBy: user?.id, config: req.body.config });
    res.json(game);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/:gameId/join', async (req,res) => {
  try {
    const gameId = req.params.gameId;
    const userData = req.body.user;
    const gs = req.app.get('gameService');
    const result = await gs.addPlayerAndBoard(gameId, userData);
    // notify
    const io = req.app.get('io');
    io.to(String(gameId)).emit('player-joined', { user: result.user._id, board: result.board._id });
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:gameId/state', async (req,res) => {
  try {
    const g = await Game.findById(req.params.gameId).populate('players').lean();
    res.json(g);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/:gameId/claim', async (req,res) => {
  try {
    const gs = req.app.get('gameService');
    const { boardId, userId } = req.body;
    const result = await gs.claimBingo({ gameId: req.params.gameId, boardId, userId });
    res.json(result);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
