var player1Moves = new Array();
var player2Moves = new Array();

// player1Moves = [0, 1, 3];
// player2Moves = [2, 4, 5];

// var currentMoves = ["X", "X", "O", "X", "O", "O", 6, 7, 8];
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
        console.log("wrong reset");
        reset();
        window.setTimeout(drawBoard(), 7000);
      } else if (checkWinner() == "tie") {
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
    console.log("should remove");
  }
}

//create copies of board and moves
function makeAiMove(board) {
  let bestScore = -Infinity;
  let bestMove;
  // let p1moves = player1Moves;
  let p2moves = player2Moves;
  let currentMovesCopy = currentMoves;

  console.log(p2moves);

  for (let i = 0; i < 9; i++) {
    if (board[i] != "X" && board[i] != "O") {
      let pos = board[i];
      currentMovesCopy[pos] = "O";
      p2moves.push(pos);
      p2moves.sort(function(a, b) {
        a - b;
      });
      let score = minimax(currentMovesCopy, 0, false, player1Moves, p2moves);
      console.log("score = " + score);
      currentMovesCopy[pos] = pos;
      p2moves.pop();
      if (score > bestScore) {
        bestScore = score;
        bestMove = pos;
      }
    }
  }
  console.log(bestMove);

  document.getElementById(bestMove).innerHTML = "O";
  player2Moves.push(bestMove);
  player2Moves.sort(function(a, b) {
    a - b;
  });
  currentMoves[bestMove] = "O";
  console.log(currentMoves);
  document.getElementById("player2").classList.remove("selected");
  document.getElementById("player1").classList.add("selected");
  document.getElementById(bestMove).removeEventListener("click", gameHandler);
  currentPlayer = 0;
}

// returns X for p1 win, O for p2, "tie" for tie or "" for neither winning
function checkWinner() {
  let result = "";

  if (player1Moves.length > 0 && player1Moves.length < 2) {
    document.getElementById("ai-button").classList.add("ai-button-visible");
  }
  let tie = 0;
  for (let i = 0; i < currentMoves.length; i++) {
    if (currentMoves[i] == "X" || currentMoves[i] == "O") {
      tie++;
    }
  }
  if (tie == 9) {
    return "tie";
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
  tie: 0
};

// function minimax(b, d, m) {
//   return 1;
// }

function minimax(board, depth, isMaximizing, p1moves, p2moves) {
  let result = checkWinner();
  if (result == "X") {
    // console.log(minimaxScores[result]);
    return minimaxScores[result] + depth;
  } else if (result == "O") {
    return minimaxScores[result] - depth;
  } else if (result == "tie") {
    return minimaxScores[result];
  }
  let p1movesCopy = p1moves;
  let p2movesCopy = p2moves;
  let currentMovesCopy = board;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      // Is the spot available?
      if (board[i] != "X" && board[i] != "O" && board[i] != i) {
        let pos = board[i];

        p1moves.push(pos);
        currentMovesCopy[i] = "X";
        let score = minimax(
          currentMovesCopy,
          depth + 1,
          false,
          p1movesCopy,
          p2movesCopy
        );
        // console.log(score);
        currentMovesCopy[i] = pos;
        bestScore = Math.max(score, bestScore);
        p1movesCopy = p1moves;
        // console.log(player1Moves);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      // Is the spot available?
      if (board[i] != "X" && board[i] != "O" && board[i] != i) {
        let pos = board[i];

        p2movesCopy.push(pos);
        currentMovesCopy[i] = "O";
        let score = minimax(
          currentMovesCopy,
          depth + 1,
          true,
          p1movesCopy,
          p2movesCopy
        );

        currentMovesCopy[i] = pos;
        bestScore = Math.min(score, bestScore);
        p2movesCopy = p2moves;
        // console.log(player2Moves);
      }
    }
    return bestScore;
  }
}

window.addEventListener("load", drawBoard);
