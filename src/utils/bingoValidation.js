// returns { valid: boolean, pattern: string|null, matchedCells: [[r,c], ...] }
function checkLine(grid, calledSet) {
  const n = grid.length;
  // rows
  for (let r=0;r<n;r++){
    const matched = [];
    let ok = true;
    for (let c=0;c<n;c++){
      const v = grid[r][c];
      if (v === null) { matched.push([r,c]); continue; }
      if (!calledSet.has(v)) { ok = false; break; }
      matched.push([r,c]);
    }
    if (ok) return { valid: true, pattern: 'row', matched };
  }
  // columns
  for (let c=0;c<n;c++){
    const matched=[];
    let ok = true;
    for (let r=0;r<n;r++){
      const v = grid[r][c];
      if (v === null) { matched.push([r,c]); continue; }
      if (!calledSet.has(v)) { ok = false; break; }
      matched.push([r,c]);
    }
    if (ok) return { valid: true, pattern: 'column', matched };
  }
  return { valid:false };
}

function checkDiags(grid, calledSet) {
  const n = grid.length;
  // TL-BR
  let ok = true; const matched1=[];
  for (let i=0;i<n;i++){
    const v = grid[i][i];
    if (v === null) { matched1.push([i,i]); continue; }
    if (!calledSet.has(v)) { ok = false; break; }
    matched1.push([i,i]);
  }
  if (ok) return { valid:true, pattern:'diag_tl_br', matched: matched1 };

  // TR-BL
  ok = true; const matched2=[];
  for (let i=0;i<n;i++){
    const v = grid[i][n-1-i];
    if (v === null) { matched2.push([i,n-1-i]); continue; }
    if (!calledSet.has(v)) { ok = false; break; }
    matched2.push([i,n-1-i]);
  }
  if (ok) return { valid:true, pattern:'diag_tr_bl', matched: matched2 };
  return { valid:false };
}

function checkFullHouse(grid, calledSet) {
  const n = grid.length;
  const matched=[];
  for (let r=0;r<n;r++){
    for (let c=0;c<n;c++){
      const v = grid[r][c];
      if (v === null) { matched.push([r,c]); continue; }
      if (!calledSet.has(v)) return { valid:false };
      matched.push([r,c]);
    }
  }
  return { valid:true, pattern:'fullhouse', matched };
}

function checkFourCorners(grid, calledSet) {
  const n = grid.length;
  const corners = [[0,0],[0,n-1],[n-1,0],[n-1,n-1]];
  const matched = [];
  for (const [r,c] of corners) {
    const v = grid[r][c];
    if (v === null) { matched.push([r,c]); continue; }
    if (!calledSet.has(v)) return { valid:false };
    matched.push([r,c]);
  }
  return { valid:true, pattern:'four-corners', matched };
}

function validate(grid, calls, allowedPatterns = ['row','column','diag','fullhouse']) {
  const calledSet = new Set(calls);
  // check each allowed pattern
  if (allowedPatterns.includes('row') || allowedPatterns.includes('column')) {
    const res = checkLine(grid, calledSet);
    if (res.valid) return res;
  }
  if (allowedPatterns.includes('diag')) {
    const res = checkDiags(grid, calledSet);
    if (res.valid) return res;
  }
  if (allowedPatterns.includes('four-corners')) {
    const res = checkFourCorners(grid, calledSet);
    if (res.valid) return res;
  }
  if (allowedPatterns.includes('fullhouse')) {
    const res = checkFullHouse(grid, calledSet);
    if (res.valid) return res;
  }
  return { valid:false };
}

module.exports = { validate };
