const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClaimSchema = new Schema({
  gameId: { type: Schema.Types.ObjectId, ref: 'Game' },
  boardId: { type: Schema.Types.ObjectId, ref: 'Board' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  callIndex: Number, // how many numbers were called when claim was made
  pattern: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Claim', ClaimSchema);
