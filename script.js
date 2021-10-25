"use strict";
const game = (() => {
  // disable drag behaviour
  window.ondragstart = function () {
    return false;
  };

  // Selector function
  function $(x) {
    return document.getElementById(x);
  }

  const tiles = Array.from(document.querySelectorAll(".tile"));

  // -----------------------------------------------------------------------------
  // Main game functions

  const isValidAction = tile => {
    if (tile.textContent === "X" || tile.textContent === "O") return false;
    return true;
  };

  const updateBoard = index => {
    board[index] = currentPlayer;
  };

  const changePlayer = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    $("game-finish").classList.add("hidden");
    tiles.forEach(tile => {
      tile.removeEventListener("click", () => humanTurn(tile, index));
      tile.textContent = "";
      tile.classList.remove("playerX");
      tile.classList.remove("playerO");
    });
  };

  const announce = type => {
    switch (type) {
      case "PLAYERX_WON":
        $("game-finish").textContent = "X's won.";
        break;
      case "PLAYERO_WON":
        $("game-finish").textContent = "O's won.";
        break;
      case "TIE":
        $("game-finish").textContent = "Tie.";
    }
    $("game-finish").classList.remove("hidden");
  };

  const checkAvailable = gameData => {
    let available = [];
    for (let i = 0; i < gameData.length; i++) {
      if (!gameData[i]) {
        available.push(i);
      }
    }
    return available;
  };

  const humanTurn = (tile, index) => {
    if (isValidAction(tile) && isGameActive) {
      tile.textContent = currentPlayer;
      tile.classList.add(`player${currentPlayer}`);
      updateBoard(index);
      checkWinner(board);
      changePlayer();
      if (opponent !== "human" && isGameActive) {
        compTurn(opponent);
      }
      console.log(board);
    }
  };

  //

  const compTurn = type => {
    if (type === "random") {
      const tempBoard = checkAvailable(board);
      const randomAvailable = Math.floor(
        Math.random() * checkAvailable(board).length
      );
      const compTurn = tempBoard[randomAvailable];
      board[compTurn] = currentPlayer;
      tiles[compTurn].textContent = currentPlayer;
      tiles[compTurn].classList.add(`player${currentPlayer}`);
    }
    if (type === "comp") {
      // minimax
    }
    checkWinner(board);
    changePlayer();
  };

  const checkWinner = gameData => {
    let roundWon = false;
    for (let i = 0; i < 8; i++) {
      const winningCondition = winningConditions[i];
      const a = gameData[winningCondition[0]];
      const b = gameData[winningCondition[1]];
      const c = gameData[winningCondition[2]];
      if (a === "" || b === "" || c === "") {
        continue;
      }

      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }
    if (roundWon) {
      announce(currentPlayer === "X" ? "PLAYERX_WON" : "PLAYERO_WON");
      isGameActive = false;
    } else if (!gameData.includes("")) announce("TIE");
  };

  const bestMove = (gameData, player) => {
    let empty = checkAvailable(gameData);
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < empty.length; i++) {
      gameData[empty[i]] = player;
      let score = minimax(gameData);
      gameData[empty[i]] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  };

  function minimax(gameData) {
    return 1;
  }

  // -----------------------------------------------------------------------------
  // Board data
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let board2 = ["X", "", "", "X", "", "X", "O", "", ""];
  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let isGameActive = true;
  let opponent = "human";

  // -----------------------------------------------------------------------------
  // Game logic

  const startGame = vs => {
    resetBoard();
    isGameActive = true;
    opponent = vs;
    Math.floor(Math.random() * 2)
      ? (currentPlayer = "X")
      : (currentPlayer = "O");

    if (currentPlayer === "O" && vs !== "human") {
      compTurn(opponent);
    }
    console.log(currentPlayer, vs, board);

    tiles.forEach((tile, index) => {
      tile.addEventListener("click", () => humanTurn(tile, index));
    });
  };

  startGame(opponent);

  // -------------------------------------------------------------------------------
  // Game start buttons
  $("btn-vs-human").addEventListener(
    "click",
    function () {
      $("btn-vs-human").classList.add("active-game");
      $("btn-vs-random").classList.remove("active-game");
      $("btn-vs-comp").classList.remove("active-game");
      startGame("human");
    },
    false
  );

  $("btn-vs-random").addEventListener(
    "click",
    function () {
      $("btn-vs-human").classList.remove("active-game");
      $("btn-vs-random").classList.add("active-game");
      $("btn-vs-comp").classList.remove("active-game");
      startGame("random");
    },
    false
  );

  $("btn-vs-comp").addEventListener(
    "click",
    function () {
      $("btn-vs-human").classList.remove("active-game");
      $("btn-vs-random").classList.remove("active-game");
      $("btn-vs-comp").classList.add("active-game");
      startGame("comp");
    },
    false
  );
})();
