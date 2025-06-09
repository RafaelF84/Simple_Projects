const initialSetup = [
  "♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜",
  "♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙",
  "♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"
];

let selected = null;
let turn = "white";
let validMoves = [];
let dragSourceIndex = null;

const board = document.getElementById("chessboard");
const boardState = [...initialSetup];

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 64; i++) {
    const square = document.createElement("div");
    square.className = "square " + ((Math.floor(i / 8) + i) % 2 === 0 ? "white" : "black");
    square.dataset.index = i;

    const piece = boardState[i];
    if (piece) {
      const pieceEl = document.createElement("span");
      pieceEl.textContent = piece;
      pieceEl.draggable = true;
      pieceEl.dataset.index = i;

      // Drag events
      pieceEl.addEventListener("dragstart", onDragStart);
      pieceEl.addEventListener("dragend", onDragEnd);

      square.appendChild(pieceEl);
    }

    // Mostrar círculos de movimentos válidos (se houver)
    if (validMoves.includes(i)) {
      const dot = document.createElement("div");
      dot.className = "dot";
      square.appendChild(dot);
    }

    // Permitir drop nas casas válidas
    square.addEventListener("dragover", onDragOver);
    square.addEventListener("drop", onDrop);

    // Seleção via click continua funcionando
    square.addEventListener("click", onSquareClick);

    board.appendChild(square);
  }
}

function onDragStart(e) {
  dragSourceIndex = parseInt(e.target.dataset.index);

  const piece = boardState[dragSourceIndex];
  if (!piece) {
    dragSourceIndex = null;
    return;
  }

  if ((turn === "white" && !isWhite(piece)) || (turn === "black" && !isBlack(piece))) {
    e.preventDefault();
    dragSourceIndex = null;
    return;
  }

  validMoves = getValidMoves(dragSourceIndex, piece);
}

function onDragEnd(e) {
  dragSourceIndex = null;
  validMoves = [];
  createBoard();
}

function onDragOver(e) {
  e.preventDefault(); // Necessário para permitir drop
}

function onDrop(e) {
  e.preventDefault();

  if (dragSourceIndex === null) return;

  const dropIndex = parseInt(e.currentTarget.dataset.index);

  if (!validMoves.includes(dropIndex)) {
    return; // movimento inválido, ignora
  }

  // Mover peça
  boardState[dropIndex] = boardState[dragSourceIndex];
  boardState[dragSourceIndex] = "";

  // Promoção de peão
  if (boardState[dropIndex] === "♙" && Math.floor(dropIndex / 8) === 0) {
    boardState[dropIndex] = "♕";
  }
  if (boardState[dropIndex] === "♟" && Math.floor(dropIndex / 8) === 7) {
    boardState[dropIndex] = "♛";
  }

  turn = turn === "white" ? "black" : "white";
  validMoves = [];
  dragSourceIndex = null;

  createBoard();
}

function onSquareClick(e) {
  const index = parseInt(e.currentTarget.dataset.index);
  const piece = boardState[index];

  if (selected === null) {
    if (piece !== "" && ((turn === "white" && isWhite(piece)) || (turn === "black" && isBlack(piece)))) {
      selected = index;
      validMoves = getValidMoves(index, piece);
      createBoard();
      document.querySelector(`[data-index="${index}"]`).classList.add("selected");
    }
  } else {
    if (index === selected) {
      clearSelection();
      return;
    }

    if (validMoves.includes(index)) {
      boardState[index] = boardState[selected];
      boardState[selected] = "";

      // Promoção de peão
      if (boardState[index] === "♙" && Math.floor(index / 8) === 0) {
        boardState[index] = "♕";
      }
      if (boardState[index] === "♟" && Math.floor(index / 8) === 7) {
        boardState[index] = "♛";
      }

      turn = turn === "white" ? "black" : "white";
    }
    clearSelection();
    createBoard();
  }
}

function clearSelection() {
  selected = null;
  validMoves = [];
}

function isWhite(piece) {
  return "♙♖♘♗♕♔".includes(piece);
}

function isBlack(piece) {
  return "♟♜♞♝♛♚".includes(piece);
}

function getValidMoves(index, piece) {
  switch (piece) {
    case "♙": return pawnMoves(index, "white");
    case "♟": return pawnMoves(index, "black");
    case "♖": return rookMoves(index, "white");
    case "♜": return rookMoves(index, "black");
    case "♘": return knightMoves(index, "white");
    case "♞": return knightMoves(index, "black");
    case "♗": return bishopMoves(index, "white");
    case "♝": return bishopMoves(index, "black");
    case "♕": return queenMoves(index, "white");
    case "♛": return queenMoves(index, "black");
    case "♔": return kingMoves(index, "white");
    case "♚": return kingMoves(index, "black");
    default: return [];
  }
}

function pawnMoves(index, color) {
  const moves = [];
  const dir = color === "white" ? -8 : 8;
  const startRow = color === "white" ? 6 : 1;
  const row = Math.floor(index / 8);
  const col = index % 8;

  if (boardState[index + dir] === "") moves.push(index + dir);
  if (row === startRow && boardState[index + dir] === "" && boardState[index + dir * 2] === "") {
    moves.push(index + dir * 2);
  }

  const diag1 = index + dir - 1;
  const diag2 = index + dir + 1;

  if (col > 0 && diag1 >= 0 && diag1 < 64 && boardState[diag1] !== "" &&
      ((color === "white" && isBlack(boardState[diag1])) || (color === "black" && isWhite(boardState[diag1])))) {
    moves.push(diag1);
  }

  if (col < 7 && diag2 >= 0 && diag2 < 64 && boardState[diag2] !== "" &&
      ((color === "white" && isBlack(boardState[diag2])) || (color === "black" && isWhite(boardState[diag2])))) {
    moves.push(diag2);
  }

  return moves;
}

function knightMoves(index, color) {
  const moves = [];
  const deltas = [-17, -15, -10, -6, 6, 10, 15, 17];

  deltas.forEach(d => {
    const to = index + d;
    if (to >= 0 && to < 64 && isValidKnightMove(index, to)) {
      const target = boardState[to];
      if (target === "" || (color === "white" && isBlack(target)) || (color === "black" && isWhite(target))) {
        moves.push(to);
      }
    }
  });

  return moves;
}

function isValidKnightMove(from, to) {
  const r1 = Math.floor(from / 8), c1 = from % 8;
  const r2 = Math.floor(to / 8), c2 = to % 8;
  return (Math.abs(r1 - r2) === 2 && Math.abs(c1 - c2) === 1) ||
         (Math.abs(r1 - r2) === 1 && Math.abs(c1 - c2) === 2);
}

function rookMoves(index, color) {
  return slideMoves(index, color, [-8, 8, -1, 1]);
}

function bishopMoves(index, color) {
  return slideMoves(index, color, [-9, -7, 7, 9]);
}

function queenMoves(index, color) {
  return slideMoves(index, color, [-8, 8, -1, 1, -9, -7, 7, 9]);
}

function kingMoves(index, color) {
  const moves = [];
  const deltas = [-9, -8, -7, -1, 1, 7, 8, 9];

  deltas.forEach(d => {
    const to = index + d;
    if (to >= 0 && to < 64 && Math.abs((to % 8) - (index % 8)) <= 1) {
      const target = boardState[to];
      if (target === "" || (color === "white" && isBlack(target)) || (color === "black" && isWhite(target))) {
        moves.push(to);
      }
    }
  });

  return moves;
}

function slideMoves(index, color, directions) {
  const moves = [];
  directions.forEach(dir => {
    let i = index;
    while (true) {
      const next = i + dir;
      if (next < 0 || next >= 64 || outOfBounds(i, next, dir)) break;
      const target = boardState[next];
      if (target === "") {
        moves.push(next);
      } else {
        if ((color === "white" && isBlack(target)) || (color === "black" && isWhite(target))) {
          moves.push(next);
        }
        break;
      }
      i = next;
    }
  });
  return moves;
}

function outOfBounds(from, to, dir) {
  const c1 = from % 8;
  const c2 = to % 8;
  // impedir "wrap" na horizontal quando andar para esquerda/direita
  if (Math.abs(c1 - c2) > 1 && Math.abs(dir) === 1) return true;
  if ((c2 === 0 && c1 === 7) || (c2 === 7 && c1 === 0)) return true;
  return false;
}

createBoard();
