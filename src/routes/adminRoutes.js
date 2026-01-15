const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

function adminAuth(req,res,next){
  // TODO: replace with JWT validation. For now simple secret in header
  if (req.headers['x-admin-secret'] === process.env.JWT_SECRET) return next();
  return res.status(401).json({ error: 'unauthorized' });
}

router.post('/:gameId/call', adminAuth, async (req,res) => {
  try {
    const gs = req.app.get('gameService');
    const pick = await gs.callNext(req.params.gameId);
    res.json({ pick });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/:gameId/start-auto', adminAuth, async (req,res) => {
  try {
    const gs = req.app.get('gameService');
    const game = await require('../models/Game').findById(req.params.gameId);
    const interval = game.autoCallIntervalMs || Number(process.env.AUTO_CALL_INTERVAL_MS) || 5000;
    gs.startAutoCaller(req.params.gameId, interval);
    // also set game autoCall true
    game.autoCall = true;
    await game.save();
    res.json({ ok:true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/:gameId/stop-auto', adminAuth, async (req,res) => {
  try {
    const gs = req.app.get('gameService');
    gs.stopAutoCaller(req.params.gameId);
    const game = await require('../models/Game').findById(req.params.gameId);
    game.autoCall = false; await game.save();
    res.json({ ok:true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/:gameId/end', adminAuth, async (req,res) => {
  try {
    const updated = await Game.findByIdAndUpdate(req.params.gameId, { status:'ended' }, { new:true });
    const io = req.app.get('io');
    io.to(String(req.params.gameId)).emit('game-ended', { gameId: req.params.gameId });
    res.json(updated);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
