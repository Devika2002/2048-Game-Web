window.onload = function () {
  const board = document.getElementById("board");
  const scoreDisplay = document.getElementById("score");
  const restartBtn = document.getElementById("restart-btn");

  let size = 4;
  let grid = [];
  let score = 0;

  function createBoard() {
    board.innerHTML = "";
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.setAttribute("id", `${i}-${j}`);
        board.appendChild(tile);
      }
    }
  }

  function randomTile() {
    let emptyTiles = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === 0) emptyTiles.push({ i, j });
      }
    }
    if (emptyTiles.length > 0) {
      let { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      grid[i][j] = Math.random() > 0.9 ? 4 : 2;
    }
  }

  function initGame() {
    grid = Array.from({ length: size }, () => Array(size).fill(0));
    score = 0;
    randomTile();
    randomTile();
    updateBoard();
  }

  function updateBoard() {
    scoreDisplay.textContent = score;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tile = document.getElementById(`${i}-${j}`);
        const value = grid[i][j];
        tile.textContent = value === 0 ? "" : value;
        tile.style.background = getColor(value);
      }
    }
  }

  function getColor(value) {
    const colors = {
      0: "#cdc1b4", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563",
      32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcc61",
      512: "#edc850", 1024: "#edc53f", 2048: "#edc22e"
    };
    return colors[value] || "#3c3a32";
  }

  function slide(row) {
    row = row.filter(val => val);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        row[i + 1] = 0;
      }
    }
    row = row.filter(val => val);
    while (row.length < size) row.push(0);
    return row;
  }

  function handleInput(direction) {
    let moved = false;
    if (direction === "left") {
      for (let i = 0; i < size; i++) {
        let row = grid[i];
        let newRow = slide(row);
        if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
        grid[i] = newRow;
      }
    } else if (direction === "right") {
      for (let i = 0; i < size; i++) {
        let row = grid[i].slice().reverse();
        let newRow = slide(row).reverse();
        if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) moved = true;
        grid[i] = newRow;
      }
    } else if (direction === "up" || direction === "down") {
      for (let j = 0; j < size; j++) {
        let col = grid.map(row => row[j]);
        if (direction === "down") col.reverse();
        let newCol = slide(col);
        if (direction === "down") newCol.reverse();
        for (let i = 0; i < size; i++) {
          if (grid[i][j] !== newCol[i]) moved = true;
          grid[i][j] = newCol[i];
        }
      }
    }

    if (moved) {
      randomTile();
      updateBoard();
      checkGameOver();
    }
  }

  function checkGameOver() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === 0) return;
        if (i < size - 1 && grid[i][j] === grid[i + 1][j]) return;
        if (j < size - 1 && grid[i][j] === grid[i][j + 1]) return;
      }
    }
    setTimeout(() => alert("Game Over! Final Score: " + score), 100);
  }

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft": handleInput("left"); break;
      case "ArrowRight": handleInput("right"); break;
      case "ArrowUp": handleInput("up"); break;
      case "ArrowDown": handleInput("down"); break;
    }
  });

  restartBtn.addEventListener("click", initGame);

  createBoard();
  initGame();
};
