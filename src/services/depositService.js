const Deposit = require('../models/Deposit');
const { credit } = require('./walletService');
const parseTelebirr = require('../utils/parseTelebirr');

async function processDeposit(telegramId, smsText) {
  const parsed = parseTelebirr(smsText);
  if (!parsed) throw new Error('Invalid SMS');

  const exists = await Deposit.findOne({ txId: parsed.txId });
  if (exists) throw new Error('Duplicate transaction');

  await Deposit.create({
    telegramId,
    amount: parsed.amount,
    txId: parsed.txId,
    rawSms: smsText
  });

  await credit(telegramId, parsed.amount);
  return parsed.amount;
}

module.exports = { processDeposit };