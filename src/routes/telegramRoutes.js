const express = require('express');
const router = express.Router();
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;

async function sendMessage(chatId, text) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { chat_id: chatId, text });
  } catch(e) { console.error('tg send err', e.message); }
}

router.post('/webhook', async (req,res) => {
  const update = req.body;
  try {
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text || '';
      if (text.startsWith('/start')) {
        // Send a web app button or a link
        await sendMessage(chatId, `Open the Bingo web app: ${process.env.BASE_URL}`);
      } else if (text.startsWith('/create')) {
        // possibly create a new game programmatically
      }
    }
  } catch(e) {
    console.error('webhook error', e);
  }
  res.sendStatus(200);
});

module.exports = router;
