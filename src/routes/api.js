const router = require('express').Router();
const gameState = require('../engine/gameState');
const { generateCards } = require('../engine/cardGenerator');
const { debit, getUser } = require('../services/walletService');
const { BET_AMOUNT } = require('../config/gameConfig');
const { requestWithdraw } = require('../services/withdrawService');

// Lobby
router.get('/lobby', (req, res) => {
  res.json({ timer: gameState.timer, cards: gameState.cards, phase: gameState.phase });
});

// Join game (with wallet deduction)
router.post('/join', async (req, res) => {
  const { telegramId, cardId } = req.body;
  try {
    if (gameState.phase !== 'LOBBY') throw new Error('Game already started');
    if (gameState.players[telegramId]) throw new Error('Already joined');

    const card = gameState.cards.find(c => c.id === cardId);
    if (!card) throw new Error('Invalid card');

    await debit(telegramId, BET_AMOUNT);

    gameState.players[telegramId] = { card: card.numbers, paid: BET_AMOUNT, cardId };
    res.json({ success: true, balanceDeducted: BET_AMOUNT });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Wallet info
router.get('/wallet/:telegramId', async (req, res) => {
  const user = await getUser(req.params.telegramId);
  res.json({ balance: user.balance });
});

// Withdraw request
router.post('/withdraw', async (req, res) => {
  const { telegramId, amount, method, account } = req.body;
  await requestWithdraw({ telegramId, amount, method, account });
  res.json({ success: true });
});

module.exports = router;