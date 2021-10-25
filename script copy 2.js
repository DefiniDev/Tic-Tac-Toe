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

  const resetBoard = () => {
    $("game-finish").classList.add("hidden");
    tiles.forEach(tile => {
      tile.removeEventListener("click", () => userAction(tile, index));
      tile.textContent = "";
      tile.classList.remove("playerX");
      tile.classList.remove("playerO");
    });
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

  const announce = type => {
    switch (type) {
      case "PLAYERO_WON":
        $("game-finish").textContent = "O's won.";
        break;
      case "PLAYERX_WON":
        $("game-finish").textContent = "X's won.";
        break;
      case "TIE":
        $("game-finish").textContent = "Tie.";
    }
    $("game-finish").classList.remove("hidden");
  };

  const minimax = (gameData, player) => {
    const checkWinner = (testBoard, player) => {
      for (let i = 0; i < 8; i++) {
        const winningCondition = winningConditions[i];
        const a = testBoard[winningCondition[0]];
        const b = testBoard[winningCondition[1]];
        const c = testBoard[winningCondition[2]];
        if (a === "" || b === "" || c === "") {
          continue;
        }
        if (a === player && b === player && c === player) {
          return true;
        } else if (!testBoard.includes("")) return "tie";
      }
    };
    // Base
    if (checkWinner(gameData, "X")) {
      return { evaluation: -10 };
    } else if (checkWinner(gameData, "O")) {
      return { evaluation: +10 };
    } else if (checkWinner(gameData) === "tie") {
      return { evaluation: 0 };
    }
    let empty = checkAvailable(gameData);
    let moves = [];
    for (let i = 0; i < empty.length; i++) {
      let id = empty[i];
      let move = {};
      move.id = id;
      let savedBoardSpace = gameData[id];
      gameData[id] = player;
      if (player == "O") {
        move.evaluation = minimax(gameData, "X").evaluation;
      } else {
        move.evaluation = minimax(gameData, "O").evaluation;
      }
      gameData[id] = savedBoardSpace;
      moves.push(move);
    }
    // Find best move
    let bestMove;
    // Maximizer
    if (player === "X") {
      let bestEvaluation = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].evaluation > bestEvaluation) {
          bestEvaluation = moves[i].evaluation;
          bestMove = moves[i];
        }
      }
    } else {
      // Minimizer
      let bestEvaluation = +Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].evaluation < bestEvaluation) {
          bestEvaluation = moves[i].evaluation;
          bestMove = moves[i];
        }
      }
    }
    return bestMove;
  };

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

  const tiles = Array.from(document.querySelectorAll(".tile"));

  const startGame = vs => {
    resetBoard();
    let isGameActive = true;
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    // console.log(vs);
    // console.log(board);

    tiles.forEach((tile, index) => {
      tile.addEventListener("click", () => userAction(tile, index));
    });

    const handleResultValidation = () => {
      let roundWon = false;
      for (let i = 0; i < 8; i++) {
        const winningCondition = winningConditions[i];
        const a = board[winningCondition[0]];
        const b = board[winningCondition[1]];
        const c = board[winningCondition[2]];
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
      } else if (!board.includes("")) announce("TIE");
    };

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

    console.log(vs);
    const userAction = (tile, index) => {
      if (isValidAction(tile) && isGameActive) {
        // console.log(board);
        tile.textContent = currentPlayer;
        tile.classList.add(`player${currentPlayer}`);
        updateBoard(index);
        handleResultValidation();
        changePlayer();
        if (currentPlayer === "O") {
          console.log(minimax(board, "O"));
        }
        console.log(currentPlayer === "O" && vs === "comp");
        // if (currentPlayer === "O" && vs === "comp") {
        //   console.log(minimax(board, "O").id);
        //   updateBoard(minimax(board, "O").id);
        //   tiles[minimax(board, "O").id].textContent = currentPlayer;
        //   tiles[minimax(board, "O").id].classList.add(`player${currentPlayer}`);
        //   changePlayer();
        // }
      }
    };
  };

  startGame("human");

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
