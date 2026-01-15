const User = require('../models/User');

async function getUser(telegramId, username = '') {
  let user = await User.findOne({ telegramId });
  if (!user) user = await User.create({ telegramId, username });
  return user;
}

async function debit(telegramId, amount) {
  const user = await getUser(telegramId);
  if (user.balance < amount) throw new Error('Insufficient balance');
  user.balance -= amount;
  await user.save();
  return user.balance;
}

async function credit(telegramId, amount) {
  const user = await getUser(telegramId);
  user.balance += amount;
  await user.save();
}

module.exports = { getUser, debit, credit };