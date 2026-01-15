function range(a,b){ const out=[]; for(let i=a;i<=b;i++) out.push(i); return out; }
function sample(arr, n) {
  const src = arr.slice();
  const res = [];
  while(res.length < n && src.length) {
    const idx = Math.floor(Math.random()*src.length);
    res.push(src.splice(idx,1)[0]);
  }
  return res;
}

function generateCard({ size = 5, freeCenter = true, poolStart =1, poolEnd=75 } = {}) {
  // Use classic Bingo column ranges if size==5 and poolEnd==75
  const grid = Array.from({length:size}, () => Array(size).fill(null));
  if (size === 5 && poolStart === 1 && poolEnd === 75) {
    const colRanges = [[1,15],[16,30],[31,45],[46,60],[61,75]];
    for (let c=0;c<5;c++){
      const nums = sample(range(colRanges[c][0], colRanges[c][1]), 5);
      for (let r=0;r<5;r++) grid[r][c] = nums[r];
    }
    if (freeCenter) grid[2][2] = null;
  } else {
    // fallback: random unique numbers
    const pool = sample(range(poolStart, poolEnd), size*size);
    for (let r=0;r<size;r++) for (let c=0;c<size;c++) grid[r][c] = pool[r*size+c];
    if (freeCenter) grid[Math.floor(size/2)][Math.floor(size/2)] = null;
  }
  return grid;
}

module.exports = { generateCard };
