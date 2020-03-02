var player1Moves = new Array();
var player2Moves = new Array();

var player1Score = 0;
var player2Score = 0;

var currentPlayer = 0;
var size = 3;

//array containing all possible combinations of winning scores
const winningScores = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
];

function drawBoard() {
  const parent = document.getElementById("game");
  var counter = 1;

  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }

  if (player1Moves.length == 0) {
    document.getElementById("ai-button").classList.remove("ai-button-visible");
  }

  for (var i = 0; i < 3; i++) {
    var row = document.createElement("tr");

    for (var x = 0; x < size; x++) {
      var col = document.createElement("td");
      col.innerHTML = counter;
      col.id = counter;

      function gameHandler(e) {
        if (currentPlayer == 0) {
          this.innerHTML = "X";
          player1Moves.push(parseInt(this.id));
          player1Moves.sort(function(a, b) {
            a - b;
          });
          document.getElementById("player1").classList.remove("selected");
          document.getElementById("player2").classList.add("selected");
        } else {
          this.innerHTML = "O";
          player2Moves.push(parseInt(this.id));
          player2Moves.sort(function(a, b) {
            a - b;
          });
          document.getElementById("player2").classList.remove("selected");
          document.getElementById("player1").classList.add("selected");
        }

        if (checkWinner()) {
          reset();
          window.setTimeout(drawBoard(), 7000);
        } else if (player1Moves.length + player2Moves.length == 9) {
          window.setTimeout(reset(), 3000);
          drawBoard();
        } else {
          if (currentPlayer == 0) currentPlayer = 1;
          else currentPlayer = 0;
          this.removeEventListener("click", arguments.callee);
        }
      }
      col.addEventListener("click", gameHandler);

      counter++;
      row.appendChild(col);
    }
    parent.appendChild(row);
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
