module.exports = {
  phase: 'LOBBY',
  players: {},        // telegramId -> { card, paid }
  cards: [],
  calledNumbers: [],
  timer: 30,
  roundId: null
};