module.exports = (state) => {
  let num;
  do {
    num = Math.floor(Math.random() * 75) + 1;
  } while(state.calledNumbers.includes(num));

  state.calledNumbers.push(num);
  return num;
};