const crypto = require('crypto');

module.exports = function verifyTelegram(initData) {
  const secret = crypto
    .createHash('sha256')
    .update(process.env.BOT_TOKEN)
    .digest();

  const dataCheck = Object.keys(initData)
    .filter(k => k !== 'hash')
    .sort()
    .map(k => `${k}=${initData[k]}`)
    .join('\n');

  const hash = crypto
    .createHmac('sha256', secret)
    .update(dataCheck)
    .digest('hex');

  return hash === initData.hash;
};
