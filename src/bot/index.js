const TelegramBot = require('node-telegram-bot-api');
const walletService = require('../services/walletService');
const initPayments = require('./payments');

const bot = new TelegramBot(process.env.BOT_TOKEN);

// /start command with WebApp button
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '🎮 Welcome to Bingo!', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Play Bingo',
          web_app: { url: process.env.WEBAPP_URL }
        }
      ]]
    }
  });
});

// WebApp messages
bot.on('web_app_data', (msg) => {
  const data = JSON.parse(msg.web_app_data.data);

  if (data.action === 'deposit') {
    bot.sendMessage(msg.chat.id, '💳 Type /deposit to add money');
  }
});

// Telegram Payments
initPayments(bot, walletService);

module.exports = bot;
