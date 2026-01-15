const mongoose = require('mongoose');
const { Schema } = mongoose;

const BoardSchema = new Schema({
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  boardNumber: Number,
  grid: [[Number]], // null allowed if free center
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Board', BoardSchema);
