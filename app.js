"use strict";

const winningCombos = [
  { combo: [1, 2, 3], targetClass: "winningLineHorizontal" },
  { combo: [4, 5, 6], targetClass: "winningLineHorizontal" },
  { combo: [7, 8, 9], targetClass: "winningLineHorizontal" },
  { combo: [1, 4, 7], targetClass: "winningLineVertical" },
  { combo: [2, 5, 8], targetClass: "winningLineVertical" },
  { combo: [3, 6, 9], targetClass: "winningLineVertical" },
  { combo: [1, 5, 9], targetClass: "winningLineHorizontal" },
  { combo: [3, 5, 7], targetClass: "winningLineReverseDiagonal" },
];

const totalScore = {
  player1: 0,
  player2: 0,
};

const playerSelections = {
  player1: [],
  player2: [],
};

let loading = false;
let nowPlaying = "";
let playingFirst = "";
const boxes = document.querySelectorAll(".box");
const player1Points = document.querySelector(".points1");
const player2Points = document.querySelector(".points2");
const player1Label = document.querySelector(".player1Label");
const player2Label = document.querySelector(".player2Label");

const newGame = () => {
  togglePlayer();
  playerSelections.player1 = [];
  playerSelections.player2 = [];
  boxes.forEach((b) => {
    b.classList.remove("selctionplayer1");
    b.classList.remove("selctionplayer2");
  });
  document.querySelector(".winningLineHorizontal").classList =
    "winningLineHorizontal";
  document.querySelector(".winningLineVertical").classList =
    "winningLineVertical";
  document.querySelector(".winningLineReverseDiagonal").classList =
    "winningLineReverseDiagonal";
};

const addBoxClass = (e) => {
  const classToAdd =
    nowPlaying === "player1" ? "selctionplayer1" : "selctionplayer2";
  e.target.classList.add(classToAdd);
};

const updateState = (e) => {
  const selection = +e.target.dataset.position;
  playerSelections[nowPlaying] = playerSelections[nowPlaying].concat(selection);
};

const findWinner = (e) => {
  if (playerSelections[nowPlaying].length < 3) return null;

  return winningCombos.find((x) =>
    x.combo.every((c) => playerSelections[nowPlaying].includes(c))
  );
};

const switchPlayer = (e) => {
  nowPlaying = nowPlaying === "player1" ? "player2" : "player1";
  player1Label.style.color = nowPlaying === "player1" ? "green" : "black";
  player2Label.style.color = nowPlaying === "player2" ? "green" : "black";
  loading = false;
};

const togglePlayer = (e) => {
  playingFirst = playingFirst === "player1" ? "player2" : "player1";
  nowPlaying = playingFirst;
  player1Label.style.color = nowPlaying === "player1" ? "green" : "black";
  player2Label.style.color = nowPlaying === "player2" ? "green" : "black";
  loading = false;
};

const checkWinner = (winnerCombo) => {
  if (!winnerCombo) {
    const totalSelections =
      playerSelections.player1.length + playerSelections.player2.length;
    //draw
    if (totalSelections === 9) {
      setTimeout(() => {
        newGame();
      }, 1000);
      return;
    }
    //switch player
    switchPlayer();
  } else {
    drawWinner(winnerCombo);
    updateWinner(winnerCombo);
    setTimeout(() => {
      newGame();
    }, 2000);
  }
};

const drawWinner = (winnerCombo) => {
  const line = document.querySelector(`.${winnerCombo.targetClass}`);
  line.classList.add(`line${winnerCombo.combo.join("")}`, nowPlaying);
};

const updateWinner = (winnerCombo) => {
  console.warn(winnerCombo);
  if (nowPlaying === "player1") {
    const currentVal = +player1Points.textContent;
    player1Points.textContent = currentVal + 1;
  } else {
    const currentVal = +player2Points.textContent;
    player2Points.textContent = currentVal + 1;
  }
};

const select = (e) => {
  if (loading) return;
  loading = true;
  addBoxClass(e);
  updateState(e);
  const winnerCombo = findWinner(e);
  checkWinner(winnerCombo);
};

//first way - one event for each bx
boxes.forEach((b) => b.addEventListener("click", select));

//second way - event delegation
// const game = document.querySelector(".game");
// game.addEventListener("click", select);

togglePlayer();
