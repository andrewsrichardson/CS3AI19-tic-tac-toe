var player1Moves = new Array();
var player2Moves = new Array();

var currentMoves = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];

var player1Score = 0;
var player2Score = 0;

var currentPlayer = 0;
var size = 3;

var isPlayingAi = false;

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
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (currentMoves[i][j] == position) currentMoves[i][j] = player;
    }
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
    if (isPlayingAi) {
      makeAiMove(currentMoves);
      if (checkWinner()) {
        reset();
        window.setTimeout(drawBoard(), 7000);
      } else if (player1Moves.length + player2Moves.length == 9) {
        window.setTimeout(reset(), 3000);
        drawBoard();
      }
    }
  } else if (!isPlayingAi) {
    this.innerHTML = "O";
    player2Moves.push(parseInt(this.id));
    player2Moves.sort(function(a, b) {
      a - b;
    });
    addToGameBoard(this.id, "O");
    document.getElementById("player2").classList.remove("selected");
    document.getElementById("player1").classList.add("selected");
  }

  if (checkWinner()) {
    reset();
    window.setTimeout(drawBoard(), 7000);
  } else if (player1Moves.length + player2Moves.length == 9) {
    window.setTimeout(reset(), 3000);
    drawBoard();
  } else if (!isPlayingAi) {
    if (currentPlayer == 0) currentPlayer = 1;
    else currentPlayer = 0;
    this.removeEventListener("click", arguments.callee);
  } else this.removeEventListener("click", arguments.callee);
}

function makeAiMove(board) {
  if (!checkWinner()) {
    let bestMove = -Infinity;
    let bestMove;
    function move() {
      for (let i = 0; i < 3; i++) {
        for (let k = 0; k < 3; k++) {
          if (board[i][k] != "X" && board[i][k] != "O") {
            var pos = board[i][k];
            // currentMoves[i][k] = 'O'

            // let score = minimax(currentMoves);
            // if (score > bestScore){
            //     bestScore = score;

            // }

            document.getElementById(pos).innerHTML = "O";
            player2Moves.push(parseInt(board[i][k]));
            player2Moves.sort(function(a, b) {
              a - b;
            });
            board[i][k] = "O";
            document.getElementById("player2").classList.remove("selected");
            document.getElementById("player1").classList.add("selected");
            document
              .getElementById(pos)
              .removeEventListener("click", gameHandler);

            return;
          }
        }
      }
    }
    move();
  }
}

function checkWinner() {
  var win = false;

  if (player1Moves.length > 0 && player1Moves.length < 2) {
    document.getElementById("ai-button").classList.add("ai-button-visible");
  }

  var currentPlayerSelections = [];

  //get player's moves who just took their turn
  if (currentPlayer == 0) {
    currentPlayerSelections = player1Moves;
  } else {
    currentPlayerSelections = player2Moves;
  }
  console.log(currentPlayerSelections);
  //if min number of moves to win have been made
  if (currentPlayerSelections.length >= 3) {
    //loop through all winnning score sets
    for (var i = 0; i < winningScores.length; i++) {
      var setToCheck = winningScores[i];
      var setFound = true;

      //check if number if in current players selections
      for (var r = 0; r < setToCheck.length; r++) {
        var foundMatchingMove = false;

        for (s = 0; s < currentPlayerSelections.length; s++) {
          if (setToCheck[r] == currentPlayerSelections[s]) {
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
        win = true;
        if (currentPlayer == 0) {
          player1Score++;
        } else player2Score++;
        break;
      }
    }
  }
  return win;
}

function reset() {
  currentPlayer = 0;
  player1Moves.length = 0;
  player2Moves.length = 0;
  document.getElementById("player2").classList.remove("selected");
  document.getElementById("player2").innerHTML =
    "Player 2 Score: " + player2Score;
  document.getElementById("player1").classList.add("selected");
  document.getElementById("player1").innerHTML =
    "Player 1 Score: " + player1Score;
}

window.addEventListener("load", drawBoard);
