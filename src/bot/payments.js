module.exports = (bot, walletService) => {

  // Send invoice
  bot.onText(/\/deposit/, (msg) => {
    bot.sendInvoice(
      msg.chat.id,
      'Bingo Wallet Top-up',
      'Add balance to play Bingo',
      'bingo-wallet',
      process.env.PROVIDER_TOKEN,
      'ETB',
      [
        { label: 'Bingo Credit (10 ETB)', amount: 1000 }
      ]
    );
  });

  // Pre-checkout
  bot.on('pre_checkout_query', (query) => {
    bot.answerPreCheckoutQuery(query.id, true);
  });

  // Successful payment
  bot.on('successful_payment', async (msg) => {
    const telegramId = msg.from.id;
    const amount = msg.successful_payment.total_amount / 100;

    await walletService.credit(telegramId, amount);

    bot.sendMessage(
      msg.chat.id,
      `✅ Deposit successful!\n💰 Balance increased by ${amount} ETB`
    );
  });
};