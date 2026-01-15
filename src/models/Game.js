const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameSchema = new Schema({
  name: { type: String },
  status: { type: String, enum: ['waiting','started','paused','ended'], default: 'waiting' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }],
  calls: { type: [Number], default: [] },
  numberPoolStart: { type: Number, default: 1 },
  numberPoolEnd: { type: Number, default: 75 },
  cardConfig: {
    size: { type: Number, default: 5 },
    freeCenter: { type: Boolean, default: true }
  },
  patternsAllowed: { type: [String], default: ['row','column','diag','fullhouse'] },
  stake: { type: Number, default: 10 },
  autoCall: { type: Boolean, default: false },
  autoCallIntervalMs: { type: Number, default: process.env.AUTO_CALL_INTERVAL_MS || 5000 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
