module.exports = function(text) {
  const amount = text.match(/ETB\s?([\d.]+)/i);
  const tx = text.match(/transaction number is ([A-Z0-9]+)/i);
  if (!amount || !tx) return null;
  return { amount: parseFloat(amount[1]), txId: tx[1] };
};
