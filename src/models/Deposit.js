const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema({
  telegramId: Number,
  amount: Number,
  txId: { type: String, unique: true },
  rawSms: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deposit', DepositSchema);