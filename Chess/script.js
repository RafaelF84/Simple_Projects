const board = document.getElementById("chessboard");
let selected = null;

const initialSetup = [
  "♜","♞","♝","♛","♚","♝","♞","♜",
  "♟","♟","♟","♟","♟","♟","♟","♟",
  "","","","","","","","",
  "","","","","","","","",
  "","","","","","","","",
  "","","","","","","","",
  "♙","♙","♙","♙","♙","♙","♙","♙",
  "♖","♘","♗","♕","♔","♗","♘","♖",
];

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 64; i++) {
    const square = document.createElement("div");
    square.className = "square " + ((Math.floor(i / 8) + i) % 2 === 0 ? "white" : "black");
    square.dataset.index = i;
    square.textContent = initialSetup[i];
    square.addEventListener("click", onSquareClick);
    board.appendChild(square);
  }
}

function onSquareClick(e) {
  const index = e.target.dataset.index;
  if (selected === null) {
    if (e.target.textContent !== "") {
      selected = index;
      e.target.classList.add("selected");
    }
  } else {
    const from = document.querySelector(`[data-index='${selected}']`);
    const to = e.target;
    to.textContent = from.textContent;
    from.textContent = "";
    from.classList.remove("selected");
    selected = null;
  }
}

createBoard();
