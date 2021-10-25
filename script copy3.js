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

  const renderBoard = clearOption => {
    for (let i = 0; i < 9; i++) {
      if (clearOption) {
        board[i] = "";
        $(`sqr-${i + 1}`).textContent = "";
        $(`sqr-${i + 1}`).style.removeProperty("background-color");
        $(`sqr-${i + 1}`).removeEventListener("click", turnClick, false);
        $(`sqr-${i + 1}`).addEventListener("click", turnClick, false);
      } else {
        $(`sqr-${i + 1}`).textContent = board[i];
      }
    }
  };

  const updateAvailable = () => {
    available = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") available.push(i);
    }
  };

  const turnClick = e => {
    turn(e.target.id[4], humanPlayer);
    console.log(board);
  };

  const turn = (squareNo, player) => {
    if (board[squareNo - 1]) return;
    else {
      board[squareNo - 1] = player;
    }
  };

  const checkWin = (board, player) => {

  }

  // Opponents
  const random = available[Math.floor(Math.random() * available.length)];

  const humanPlayer = "X";
  const compPlayer = "O";
  const startGame = opponent => {
    let gameActive = true;
    let board = ["", "", "", "", "", "", "", "", ""];
    let available = ["", "", "", "", "", "", "", "", ""];

    $("game-finish").style.display = "none";
    renderBoard(true);
    let activePlayer = Math.floor(Math.random() * 2);
    updateAvailable();
    console.log(activePlayer);

    while (gameActive) {
      if (!activePlayer) {
        turn(opponent, compPlayer);
        activePlayer = 1;
      }

      if (activePlayer) updateAvailable();

      console.log(available);
      console.log(board);
    }
  };
  startGame(random);

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
