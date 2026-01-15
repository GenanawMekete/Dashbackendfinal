const { credit } = require('./walletService');

async function refundAllPlayers(players) {
  for (const [telegramId, data] of Object.entries(players)) {
    if (data.paid && data.paid > 0) await credit(Number(telegramId), data.paid);
  }
}

module.exports = { refundAllPlayers };
