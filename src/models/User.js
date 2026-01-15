const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
  telegramId: { type: Number, index: true },
  username: String,
  displayName: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
