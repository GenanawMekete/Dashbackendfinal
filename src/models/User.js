const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  telegramId: { type: Number, unique: true },
  username: String,
  balance: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);