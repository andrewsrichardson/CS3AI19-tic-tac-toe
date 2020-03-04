var player1Moves = new Array();
var player2Moves = new Array();

var currentMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];

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

//array containing all possible combinations of winning scores
const winningScores = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function addToGameBoard(position, player) {
  for (var i = 0; i < 9; i++) {
    if (currentMoves[i] == position) currentMoves[i] = player;
  }
}

function drawBoard() {
  const parent = document.getElementById("game");

  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }

  if (player1Moves.length == 0) {
    document.getElementById("ai-button").classList.remove("ai-button-visible");
  }

  var counter = 0;
  for (var i = 0; i < 3; i++) {
    var row = document.createElement("tr");
    for (var x = 0; x < size; x++) {
      var col = document.createElement("td");
      //   col.innerHTML = counter;
      col.id = counter;
      col.addEventListener("click", gameHandler);
      row.appendChild(col);
      counter++;
    }
    parent.appendChild(row);
  }
}

function gameHandler(e) {
  if (currentPlayer == 0) {
    this.innerHTML = "X";
    player1Moves.push(parseInt(this.id));
    player1Moves.sort(function(a, b) {
      a - b;
    });
    addToGameBoard(this.id, "X");
    document.getElementById("player1").classList.remove("selected");
    document.getElementById("player2").classList.add("selected");
    if (isPlayingAi && checkWinner() == "") {
      currentPlayer = 1;
      makeAiMove(currentMoves);
      if (checkWinner() == "X" || checkWinner() == "O") {
        reset();
        window.setTimeout(drawBoard(), 7000);
      } else if (player1Moves.length + player2Moves.length == 9) {
        window.setTimeout(reset(), 3000);
        drawBoard();
      }
    }
  } else if (!isPlayingAi && currentPlayer == 1) {
    this.innerHTML = "O";
    player2Moves.push(parseInt(this.id));
    player2Moves.sort(function(a, b) {
      a - b;
    });
    addToGameBoard(this.id, "O");
    document.getElementById("player2").classList.remove("selected");
    document.getElementById("player1").classList.add("selected");
  }

  if (checkWinner() == "X") {
    player1Score++;
    reset();
    window.setTimeout(drawBoard(), 7000);
  } else if (checkWinner() == "O") {
    player2Score++;
    reset();
    window.setTimeout(drawBoard(), 7000);
  } else if (player1Moves.length + player2Moves.length == 9) {
    window.setTimeout(reset(), 3000);
    drawBoard();
  } else if (!isPlayingAi) {
    if (currentPlayer == 0) currentPlayer = 1;
    else currentPlayer = 0;
  } else this.removeEventListener("click", arguments.callee);
}

function makeAiMove(board) {
  let bestScore = -Infinity;
  let bestMove;
  const p1moves = player1Moves;
  const p2moves = player2Moves;
  console.log(p2moves);

  for (let i = 0; i < 9; i++) {
    if (board[i] != "X" && board[i] != "O") {
      let pos = board[i];
      currentMoves[pos] = "O";
      player2Moves.push(pos);
      player2Moves.sort(function(a, b) {
        a - b;
      });
      let score = minimax(currentMoves, 0, false);
      currentMoves[pos] = pos;
      player2Moves.pop();
      if (score > bestScore) {
        bestScore = score;
        bestMove = pos;
      }
    }
    player2Moves = p2moves;
    player1Moves = p1moves;
  }
  //   console.log(bestMove);
  //   console.log(currentMoves);
  //   console.log(player1Moves);
  //   console.log(player2Moves);

  document.getElementById(bestMove).innerHTML = "O";
  player2Moves.push(bestMove);
  player2Moves.sort(function(a, b) {
    a - b;
  });
  currentMoves[bestMove] = "O";
  document.getElementById("player2").classList.remove("selected");
  document.getElementById("player1").classList.add("selected");
  document.getElementById(bestMove).removeEventListener("click", gameHandler);
  currentPlayer = 0;
  console.log(currentMoves);
  console.log(player2Moves);
}

// returns X for p1 win, O for p2 or "" for neither winning
function checkWinner() {
  let result = "";

  if (player1Moves.length > 0 && player1Moves.length < 2) {
    document.getElementById("ai-button").classList.add("ai-button-visible");
  }

  //if min number of moves to win have been made
  if (player1Moves.length >= 3) {
    //loop through all winnning score sets
    for (var i = 0; i < winningScores.length; i++) {
      var setToCheck = winningScores[i];
      var setFound = true;

      //check if number if in current players selections
      for (var r = 0; r < setToCheck.length; r++) {
        var foundMatchingMove = false;

        for (s = 0; s < player1Moves.length; s++) {
          if (setToCheck[r] == player1Moves[s]) {
            foundMatchingMove = true;
            break;
          }
        }
        if (foundMatchingMove == false) {
          setFound = false;
          break;
        }
      }

      if (setFound == true) {
        return "X";
      }
    }
  }

  if (player2Moves.length >= 3) {
    //loop through all winnning score sets
    for (var i = 0; i < winningScores.length; i++) {
      var setToCheck = winningScores[i];
      var setFound = true;

      //check if number if in current players selections
      for (var r = 0; r < setToCheck.length; r++) {
        var foundMatchingMove = false;

        for (s = 0; s < player2Moves.length; s++) {
          if (setToCheck[r] == player2Moves[s]) {
            foundMatchingMove = true;
            break;
          }
        }
        if (foundMatchingMove == false) {
          setFound = false;
          break;
        }
      }

      if (setFound == true) {
        return "O";
      }
    }
  }
  return result;
}

function reset() {
  currentPlayer = 0;
  player1Moves.length = 0;
  player2Moves.length = 0;
  currentMoves = [];
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
  "": 0
};

function minimax(b, d, m) {
  return 1;
}

// function minimax(board, depth, isMaximizing) {
//   let result = checkWinner();
//   if (result !== "") {
//     return minimaxScores[result];
//   }
//   if (isMaximizing) {
//     let bestScore = -Infinity;
//     for (let i = 0; i < 9; i++) {
//       // Is the spot available?
//       if (board[i] != "X" && board[i] != "O") {
//         let pos = board[i];

//         player2Moves.push(pos);
//         board[i] = "O";
//         let score = minimax(board, depth + 1, false);
//         board[i] = pos;
//         bestScore = Math.max(score, bestScore);

//       }
//     }
//     return bestScore;
//   } else {
//     let bestScore = Infinity;
//     for (let i = 0; i < 9; i++) {
//       // Is the spot available?
//       if (board[i] != "X" && board[i] != "O") {
//         let pos = board[i];
//         player1Moves.push(pos);
//         board[i] = "X";
//         let score = minimax(board, depth + 1, true);
//         board[i] = pos;
//         bestScore = Math.min(score, bestScore);
//       }
//     }
//     return bestScore;
//   }
// }

window.addEventListener("load", drawBoard);
