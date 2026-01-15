const router = require('express').Router();
const Withdraw = require('../models/Withdraw');
const { approveWithdraw } = require('../services/withdrawService');
const { debit } = require('../services/walletService');

router.get('/withdraws', async (req, res) => {
  res.json(await Withdraw.find({ status: 'PENDING' }));
});

router.post('/withdraw/:id/approve', async (req, res) => {
  await approveWithdraw(req.params.id, debit);
  res.json({ success: true });
});

module.exports = router;