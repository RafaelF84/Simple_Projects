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

let canCastle = {
  whiteKing: true,
  whiteRookA: true,
  whiteRookH: true,
  blackKing: true,
  blackRookA: true,
  blackRookH: true,
};
let enPassantTarget = null;

let moveHistory = [];
let lastMoveInfo = "";

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

  // Castling
  if (boardState[dragSourceIndex] === "♔" && dragSourceIndex === 60 && dropIndex === 62) {
    // White kingside
    boardState[61] = boardState[63];
    boardState[63] = "";
    canCastle.whiteKing = false;
    canCastle.whiteRookH = false;
  } else if (boardState[dragSourceIndex] === "♔" && dragSourceIndex === 60 && dropIndex === 58) {
    // White queenside
    boardState[59] = boardState[56];
    boardState[56] = "";
    canCastle.whiteKing = false;
    canCastle.whiteRookA = false;
  } else if (boardState[dragSourceIndex] === "♚" && dragSourceIndex === 4 && dropIndex === 6) {
    // Black kingside
    boardState[5] = boardState[7];
    boardState[7] = "";
    canCastle.blackKing = false;
    canCastle.blackRookH = false;
  } else if (boardState[dragSourceIndex] === "♚" && dragSourceIndex === 4 && dropIndex === 2) {
    // Black queenside
    boardState[3] = boardState[0];
    boardState[0] = "";
    canCastle.blackKing = false;
    canCastle.blackRookA = false;
  }

  // En passant capture
  if (boardState[dragSourceIndex] === "♙" && dropIndex === enPassantTarget - 8) {
    boardState[enPassantTarget] = "";
  }
  if (boardState[dragSourceIndex] === "♟" && dropIndex === enPassantTarget + 8) {
    boardState[enPassantTarget] = "";
  }

  // Mover peça
  boardState[dropIndex] = boardState[dragSourceIndex];
  boardState[dragSourceIndex] = "";

  // Atualizar castling rights
  if (boardState[dropIndex] === "♔") canCastle.whiteKing = false;
  if (boardState[dropIndex] === "♚") canCastle.blackKing = false;
  if (dragSourceIndex === 63) canCastle.whiteRookH = false;
  if (dragSourceIndex === 56) canCastle.whiteRookA = false;
  if (dragSourceIndex === 7) canCastle.blackRookH = false;
  if (dragSourceIndex === 0) canCastle.blackRookA = false;

  // Promoção de peão
  if (boardState[dropIndex] === "♙" && Math.floor(dropIndex / 8) === 0) {
    boardState[dropIndex] = "♕";
  }
  if (boardState[dropIndex] === "♟" && Math.floor(dropIndex / 8) === 7) {
    boardState[dropIndex] = "♛";
  }

  // En passant target
  if (boardState[dropIndex] === "♙" && dragSourceIndex - dropIndex === 16) {
    enPassantTarget = dropIndex + 8;
  } else if (boardState[dropIndex] === "♟" && dropIndex - dragSourceIndex === 16) {
    enPassantTarget = dropIndex - 8;
  } else {
    enPassantTarget = null;
  }

  // Record move
  let moveNotation = getMoveNotation(dragSourceIndex, dropIndex, boardState[dropIndex]);
  moveHistory.push(moveNotation);

  // Check/checkmate/stalemate info
  let status = getGameStatus();
  lastMoveInfo = status;
  renderMoveInfo();

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
      // Castling
      if (boardState[selected] === "♔" && selected === 60 && index === 62) {
        boardState[61] = boardState[63];
        boardState[63] = "";
        canCastle.whiteKing = false;
        canCastle.whiteRookH = false;
      } else if (boardState[selected] === "♔" && selected === 60 && index === 58) {
        boardState[59] = boardState[56];
        boardState[56] = "";
        canCastle.whiteKing = false;
        canCastle.whiteRookA = false;
      } else if (boardState[selected] === "♚" && selected === 4 && index === 6) {
        boardState[5] = boardState[7];
        boardState[7] = "";
        canCastle.blackKing = false;
        canCastle.blackRookH = false;
      } else if (boardState[selected] === "♚" && selected === 4 && index === 2) {
        boardState[3] = boardState[0];
        boardState[0] = "";
        canCastle.blackKing = false;
        canCastle.blackRookA = false;
      }

      // En passant capture
      if (boardState[selected] === "♙" && index === enPassantTarget - 8) {
        boardState[enPassantTarget] = "";
      }
      if (boardState[selected] === "♟" && index === enPassantTarget + 8) {
        boardState[enPassantTarget] = "";
      }

      boardState[index] = boardState[selected];
      boardState[selected] = "";

      // Atualizar castling rights
      if (boardState[index] === "♔") canCastle.whiteKing = false;
      if (boardState[index] === "♚") canCastle.blackKing = false;
      if (selected === 63) canCastle.whiteRookH = false;
      if (selected === 56) canCastle.whiteRookA = false;
      if (selected === 7) canCastle.blackRookH = false;
      if (selected === 0) canCastle.blackRookA = false;

      // Promoção de peão
      if (boardState[index] === "♙" && Math.floor(index / 8) === 0) {
        boardState[index] = "♕";
      }
      if (boardState[index] === "♟" && Math.floor(index / 8) === 7) {
        boardState[index] = "♛";
      }

      // En passant target
      if (boardState[index] === "♙" && selected - index === 16) {
        enPassantTarget = index + 8;
      } else if (boardState[index] === "♟" && index - selected === 16) {
        enPassantTarget = index - 8;
      } else {
        enPassantTarget = null;
      }

      // Record move
      let moveNotation = getMoveNotation(selected, index, boardState[index]);
      moveHistory.push(moveNotation);

      // Check/checkmate/stalemate info
      let status = getGameStatus();
      lastMoveInfo = status;
      renderMoveInfo();

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
  const color = isWhite(piece) ? "white" : "black";
  let moves = getRawMoves(index, piece, boardState);

  // Filter out moves that leave king in check
  moves = moves.filter(to => {
    const tempState = [...boardState];
    tempState[to] = tempState[index];
    tempState[index] = "";
    // Remove captured en passant pawn
    if (piece === "♙" && to === enPassantTarget - 8) tempState[enPassantTarget] = "";
    if (piece === "♟" && to === enPassantTarget + 8) tempState[enPassantTarget] = "";
    // Handle castling rook move
    if (piece === "♔" && index === 60 && to === 62) { tempState[61] = tempState[63]; tempState[63] = ""; }
    if (piece === "♔" && index === 60 && to === 58) { tempState[59] = tempState[56]; tempState[56] = ""; }
    if (piece === "♚" && index === 4 && to === 6) { tempState[5] = tempState[7]; tempState[7] = ""; }
    if (piece === "♚" && index === 4 && to === 2) { tempState[3] = tempState[0]; tempState[0] = ""; }
    const kingIdx = piece === "♔" || piece === "♚" ? to : kingPosition(color, tempState);
    return !isSquareAttacked(kingIdx, color === "white" ? "black" : "white", tempState);
  });

  return moves;
}

function pawnMoves(index, color, state = boardState) {
  const moves = [];
  const dir = color === "white" ? -8 : 8;
  const startRow = color === "white" ? 6 : 1;
  const row = Math.floor(index / 8);
  const col = index % 8;

  if (state[index + dir] === "") moves.push(index + dir);
  if (row === startRow && state[index + dir] === "" && state[index + dir * 2] === "") {
    moves.push(index + dir * 2);
  }

  const diag1 = index + dir - 1;
  const diag2 = index + dir + 1;

  if (col > 0 && diag1 >= 0 && diag1 < 64 && state[diag1] !== "" &&
      ((color === "white" && isBlack(state[diag1])) || (color === "black" && isWhite(state[diag1])))) {
    moves.push(diag1);
  }

  if (col < 7 && diag2 >= 0 && diag2 < 64 && state[diag2] !== "" &&
      ((color === "white" && isBlack(state[diag2])) || (color === "black" && isWhite(state[diag2])))) {
    moves.push(diag2);
  }

  // En passant
  if (enPassantTarget !== null) {
    if (color === "white" && row === 3 && (index - 1 === enPassantTarget || index + 1 === enPassantTarget)) {
      if (index - 1 === enPassantTarget) moves.push(enPassantTarget - 8);
      if (index + 1 === enPassantTarget) moves.push(enPassantTarget - 8);
    }
    if (color === "black" && row === 4 && (index - 1 === enPassantTarget || index + 1 === enPassantTarget)) {
      if (index - 1 === enPassantTarget) moves.push(enPassantTarget + 8);
      if (index + 1 === enPassantTarget) moves.push(enPassantTarget + 8);
    }
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

function rookMoves(index, color, state = boardState) {
  return slideMoves(index, color, [-8, 8, -1, 1], state);
}

function bishopMoves(index, color, state = boardState) {
  return slideMoves(index, color, [-9, -7, 7, 9], state);
}

function queenMoves(index, color, state = boardState) {
  return slideMoves(index, color, [-8, 8, -1, 1, -9, -7, 7, 9], state);
}

function kingMoves(index, color, state = boardState) {
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

  // Castling
  if (color === "white" && canCastle.whiteKing && index === 60) {
    // Kingside
    if (canCastle.whiteRookH && boardState[61] === "" && boardState[62] === "") {
      moves.push(62);
    }
    // Queenside
    if (canCastle.whiteRookA && boardState[59] === "" && boardState[58] === "" && boardState[57] === "") {
      moves.push(58);
    }
  }
  if (color === "black" && canCastle.blackKing && index === 4) {
    // Kingside
    if (canCastle.blackRookH && boardState[5] === "" && boardState[6] === "") {
      moves.push(6);
    }
    // Queenside
    if (canCastle.blackRookA && boardState[3] === "" && boardState[2] === "" && boardState[1] === "") {
      moves.push(2);
    }
  }

  return moves;
}

function slideMoves(index, color, directions, state = boardState) {
  const moves = [];
  directions.forEach(dir => {
    let i = index;
    while (true) {
      const next = i + dir;
      if (next < 0 || next >= 64 || outOfBounds(i, next, dir)) break;
      const target = state[next];
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

function kingPosition(color, state = boardState) {
  const king = color === "white" ? "♔" : "♚";
  return state.findIndex(p => p === king);
}

function isSquareAttacked(square, attackerColor, state = boardState) {
  for (let i = 0; i < 64; i++) {
    const piece = state[i];
    if ((attackerColor === "white" && isWhite(piece)) || (attackerColor === "black" && isBlack(piece))) {
      const moves = getRawMoves(i, piece, state, true); // true: ignore king safety
      if (moves.includes(square)) return true;
    }
  }
  return false;
}

// Returns all moves for a piece, ignoring king safety
function getRawMoves(index, piece, state, ignoreKingSafety = false) {
  // Copy your getValidMoves logic, but use 'state' instead of 'boardState'
  // and skip king safety filtering if ignoreKingSafety is true
  // For brevity, you can call your existing move functions but pass 'state'
  // as an extra argument if needed. For now, just use getValidMoves.
  // This is a simplified approach.
  switch (piece) {
    case "♙": return pawnMoves(index, "white", state);
    case "♟": return pawnMoves(index, "black", state);
    case "♖": return rookMoves(index, "white", state);
    case "♜": return rookMoves(index, "black", state);
    case "♘": return knightMoves(index, "white", state);
    case "♞": return knightMoves(index, "black", state);
    case "♗": return bishopMoves(index, "white", state);
    case "♝": return bishopMoves(index, "black", state);
    case "♕": return queenMoves(index, "white", state);
    case "♛": return queenMoves(index, "black", state);
    case "♔": return kingMoves(index, "white", state);
    case "♚": return kingMoves(index, "black", state);
    default: return [];
  }
}

function getMoveNotation(from, to, piece) {
  const files = "abcdefgh";
  const fromSq = files[from % 8] + (8 - Math.floor(from / 8));
  const toSq = files[to % 8] + (8 - Math.floor(to / 8));
  let symbol = "";
  if (piece === "♙" || piece === "♟") symbol = "";
  else if (piece === "♔" || piece === "♚") symbol = "K";
  else if (piece === "♕" || piece === "♛") symbol = "Q";
  else if (piece === "♖" || piece === "♜") symbol = "R";
  else if (piece === "♗" || piece === "♝") symbol = "B";
  else if (piece === "♘" || piece === "♞") symbol = "N";
  return symbol + fromSq + "-" + toSq;
}

function getGameStatus() {
  const color = turn;
  const kingIdx = kingPosition(color);
  const inCheck = isSquareAttacked(kingIdx, color === "white" ? "black" : "white");
  let hasMoves = false;
  for (let i = 0; i < 64; i++) {
    const piece = boardState[i];
    if ((color === "white" && isWhite(piece)) || (color === "black" && isBlack(piece))) {
      if (getValidMoves(i, piece).length > 0) {
        hasMoves = true;
        break;
      }
    }
  }
  if (inCheck && !hasMoves) {
    return "Checkmate! " + (color === "white" ? "Black" : "White") + " wins!";
  } else if (!inCheck && !hasMoves) {
    return "Stalemate!";
  } else if (inCheck) {
    return (color === "white" ? "White" : "Black") + " is in check!";
  } else {
    return ""; // No message if just a normal turn
  }
}

function renderMoveInfo() {
  document.getElementById("move-info").textContent = getGameStatus();
  document.getElementById("move-history").innerHTML = moveHistory.map((move, i) =>
    `<div>${i % 2 === 0 ? (Math.floor(i / 2) + 1) + "." : ""} ${move}</div>`
  ).join("");
}

document.getElementById("toggle-history").onclick = function() {
  document.getElementById("move-history-panel").style.display = "block";
};
document.getElementById("close-history").onclick = function() {
  document.getElementById("move-history-panel").style.display = "none";
};

createBoard();
renderMoveInfo();