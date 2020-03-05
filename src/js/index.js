// var player1Moves = new Array();
// var player2Moves = new Array();

// player1Moves = [0, 1, 3];
// player2Moves = [2, 4, 5];

// var currentMoves = ["X", "X", "O", "X", "O", "O", 6, 7, 8];
// var currentMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];

var board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

const boardSpots = {
  0: [0, 0],
  1: [0, 1],
  2: [0, 2],
  3: [1, 0],
  4: [1, 1],
  5: [1, 2],
  6: [2, 0],
  7: [2, 1],
  8: [2, 2]
};

var player1Score = 0;
var player2Score = 0;

var currentPlayer = 0;
var size = 3;

var isPlayingAi = true;

function setPlayingAi() {
  isPlayingAi = true;
}
function setPlayingHuman() {
  isPlayingAi = false;
}

function addToGameBoard(position, player) {
  let location = boardSpots[position];
  let x = location[0];
  let y = location[1];
  board[x][y] = player;
}

function drawBoard() {
  const parent = document.getElementById("game");

  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }

  // if (player1Moves.length == 0) {
  //   document.getElementById("ai-button").classList.remove("ai-button-visible");
  // }

  var counter = 0;
  for (var i = 0; i < 3; i++) {
    var row = document.createElement("tr");
    for (var x = 0; x < size; x++) {
      var col = document.createElement("td");
      col.id = counter;
      col.addEventListener("click", gameHandler);
      row.appendChild(col);
      counter++;
    }
    parent.appendChild(row);
  }
  makeAiMove(board);
}

function gameHandler(e) {
  if (currentPlayer == 0) {
    this.innerHTML = "O";
    addToGameBoard(this.id, "O");
    document.getElementById("player1").classList.remove("selected");
    document.getElementById("player2").classList.add("selected");
    if (isPlayingAi && checkWinner() == null) {
      currentPlayer = 1;
      makeAiMove(board);

      if (checkWinner() == "X" || checkWinner() == "O") {
        reset();
        window.setTimeout(drawBoard(), 7000);
      } else if (checkWinner() == "tie") {
        window.setTimeout(reset(), 3000);
        drawBoard();
      }
    }
  } else if (!isPlayingAi && currentPlayer == 1) {
    this.innerHTML = "O";
    addToGameBoard(this.id, "O");
    document.getElementById("player2").classList.remove("selected");
    document.getElementById("player1").classList.add("selected");
  }

  if (checkWinner() == "X") {
    this.removeEventListener("click", arguments.callee);
    player1Score++;
    reset();
    window.setTimeout(drawBoard(), 7000);
  } else if (checkWinner() == "O") {
    this.removeEventListener("click", arguments.callee);
    player2Score++;
    reset();
    window.setTimeout(drawBoard(), 7000);
  } else if (checkWinner() == "tie") {
    this.removeEventListener("click", arguments.callee);
    window.setTimeout(reset(), 3000);
    drawBoard();
  } else if (!isPlayingAi) {
    this.removeEventListener("click", arguments.callee);

    if (currentPlayer == 0) currentPlayer = 1;
    else currentPlayer = 0;
  } else {
    this.removeEventListener("click", arguments.callee);
  }
}

function makeAiMove(board) {
  let bestScore = -Infinity;
  let bestMove = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] != "X" && board[i][j] != "O") {
        board[i][j] = "X";
        let score = minimax(board, 0, false);
        board[i][j] = "";

        if (score > bestScore) {
          bestScore = score;
          move = [i, j];
          bestMove = getKeyByValue(boardSpots, move);
        }
      }
    }
  }

  document.getElementById(bestMove).innerHTML = "X";
  addToGameBoard(bestMove, "X");

  document.getElementById("player2").classList.remove("selected");
  document.getElementById("player1").classList.add("selected");
  document.getElementById(bestMove).removeEventListener("click", gameHandler);
  currentPlayer = 0;
}

function equals3(a, b, c) {
  return a == b && b == c && a != "";
}

function checkWinner() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == "") {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return "tie";
  } else {
    return winner;
  }
}

function reset() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];
  document.getElementById("player2").classList.remove("selected");
  document.getElementById("player2").innerHTML =
    "Player 2 Score: " + player2Score;
  document.getElementById("player1").classList.add("selected");
  document.getElementById("player1").innerHTML =
    "Player 1 Score: " + player1Score;
}

const minimaxScores = {
  X: 10,
  O: -10,
  tie: 0
};

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  // console.log(result);
  if (result == "X") {
    return minimaxScores[result];
  } else if (result == "O") {
    return minimaxScores[result];
  } else if (result == "tie") {
    return minimaxScores[result];
  }
  if (isMaximizing) {
    let bestScore = -100;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] != "X" && board[i][j] != "O") {
          board[i][j] = "O";
          let score = minimax(board, depth + 1, false);
          board[i][j] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = 100;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] != "X" && board[i][j] != "O") {
          board[i][j] = "X";
          let score = minimax(board, depth + 1, true);
          board[i][j] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(
    key => object[key].toString() === value.toString()
  );
}

window.addEventListener("load", drawBoard);
