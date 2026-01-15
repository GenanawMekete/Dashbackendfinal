const Withdraw = require('../models/Withdraw');

async function requestWithdraw(data) {
  return Withdraw.create(data);
}

async function approveWithdraw(id, debitFn) {
  const w = await Withdraw.findById(id);
  if (!w || w.status !== 'PENDING') throw new Error();
  await debitFn(w.telegramId, w.amount);
  w.status = 'APPROVED';
  return w.save();
}

module.exports = { requestWithdraw, approveWithdraw };