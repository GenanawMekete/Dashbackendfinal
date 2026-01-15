function generateCards(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    numbers: Array.from({ length: 25 }, () => Math.floor(Math.random() * 75) + 1)
  }));
}

module.exports = { generateCards };