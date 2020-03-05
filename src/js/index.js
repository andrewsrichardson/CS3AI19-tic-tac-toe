var board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

//object containing keys relevant to spots. used for referencing html table id's
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

//helper function to get the above keys
function getKeyByValue(object, value) {
  return Object.keys(object).find(
    key => object[key].toString() === value.toString()
  );
}

//player's scores
var player1Score = 0;
var player2Score = 0;

//current player that needs to make a move
var currentPlayer = 0;

var isPlayingAi = false;

function togglePlayingAi() {
  isPlayingAi = !isPlayingAi;
}

//adds the desired position to the game board for the player which is passed.
function addToGameBoard(position, player) {
  let location = boardSpots[position];
  let x = location[0];
  let y = location[1];
  board[x][y] = player;
}

//sets up the game board. 3x3 html table is created and click handlers placed in each. each have
//an id related to their position
function drawBoard() {
  const parent = document.getElementById("game");

  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }

  var counter = 0;
  for (var i = 0; i < 3; i++) {
    var row = document.createElement("tr");
    for (var x = 0; x < 3; x++) {
      var col = document.createElement("td");
      col.id = counter;
      col.addEventListener("click", gameHandler);
      row.appendChild(col);
      counter++;
    }
    parent.appendChild(row);
  }
  if (isPlayingAi) makeAiMove(board);
}

//inserts a click handler into each slot on the grid which updates the game state if clicked
function gameHandler(e) {
  //if player 1
  if (currentPlayer == 0) {
    //update the board with this move
    this.innerHTML = "O";
    addToGameBoard(this.id, "O");
    //swap active player notation
    document.getElementById("player1").classList.remove("selected");
    document.getElementById("player2").classList.add("selected");

    //if playing vs ai
    if (isPlayingAi && checkWinner() == null) {
      //make it move and update the board
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
    //same as above but for the other pvp player
    this.innerHTML = "O";
    addToGameBoard(this.id, "O");
    document.getElementById("player2").classList.remove("selected");
    document.getElementById("player1").classList.add("selected");
  }

  //check if someone has won, update the score if so
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
  } //if not then swap the player's turns
  else if (!isPlayingAi) {
    this.removeEventListener("click", arguments.callee);

    if (currentPlayer == 0) currentPlayer = 1;
    else currentPlayer = 0;
  } //or if playing the ai then just remove the click function as board placement is handled by the ai
  else {
    this.removeEventListener("click", arguments.callee);
  }
}

//helper function to see if spots on the board contain the same move
function equal(a, b, c) {
  return a == b && b == c && a != "";
}

//checks the game board and returns either the winner, tie or null if the game should continue
function checkWinner() {
  let winner = null;

  for (let i = 0; i < 3; i++) {
    if (equal(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  for (let i = 0; i < 3; i++) {
    if (equal(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  if (equal(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equal(board[2][0], board[1][1], board[0][2])) {
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

//resets the board and updates the player's scores
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

//the ai's turn
function makeAiMove(board) {
  let bestScore = -Infinity;
  let bestMove = 0;

  //for all avialible spots on the board..
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] != "X" && board[i][j] != "O") {
        //call minimax
        board[i][j] = "X";
        let score = minimax(board, 0, false);
        board[i][j] = "";

        // and if this spot produced a better score, store it
        if (score > bestScore) {
          bestScore = score;
          move = [i, j];
          bestMove = getKeyByValue(boardSpots, move);
        }
      }
    }
  }

  //then using the best move, update the board
  document.getElementById(bestMove).innerHTML = "X";
  addToGameBoard(bestMove, "X");
  document.getElementById("player2").classList.remove("selected");
  document.getElementById("player1").classList.add("selected");
  document.getElementById(bestMove).removeEventListener("click", gameHandler);
  //and give control back to the player.
  currentPlayer = 0;
}

//scores for each minimax result
const minimaxScores = {
  X: 10,
  O: -10,
  tie: 0
};

function minimax(board, depth, isMaximizing) {
  //first, check if this move simulation ends the game
  let result = checkWinner();
  //and return the appropriate scores
  if (result == "X") {
    return minimaxScores[result];
  } else if (result == "O") {
    return minimaxScores[result];
  } else if (result == "tie") {
    return minimaxScores[result];
  }
  //or recursively call minimax
  if (isMaximizing) {
    //return the highest score on the maximising turn
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
    //return the lowest score on the minimising turn
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

//create the game board on load
window.addEventListener("load", drawBoard);
