const mongoose = require('mongoose');

const WithdrawSchema = new mongoose.Schema({
  telegramId: Number,
  amount: Number,
  method: String,
  account: String,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Withdraw', WithdrawSchema);
