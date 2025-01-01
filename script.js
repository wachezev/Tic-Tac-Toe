const PLAYER_X_CLASS = "x";
const PLAYER_O_CLASS = "o";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");
const restartButton = document.getElementById("restart");
const winningMessageTextElement = document.getElementById("winningMessagetext");
const timerElement = document.getElementById("timer");
let isPlayer_O_Turn = false;
let restartCounter = 0;
const MAX_RESTARTS = 10;
const COOLDOWN_TIME = 10000; // 10 seconds

startGame();

restartButton.addEventListener("click", () => {
  restartCounter++;
  if (restartCounter >= MAX_RESTARTS) {
    winningMessageTextElement.innerText = "Calm down, and touch grass"; // Try dey touch grass
    winningMessageElement.classList.add("show");
    restartButton.disabled = true;
    startCooldownTimer(COOLDOWN_TIME / 1000);
    setTimeout(() => {
      restartCounter = 0;
      restartButton.disabled = false;
      startGame();
      timerElement.innerText = "";
    }, COOLDOWN_TIME);
  } else {
    startGame();
  }
});

function startCooldownTimer(seconds) {
  let remainingTime = seconds;
  timerElement.innerText = `Cooldown: ${remainingTime}s`;
  const interval = setInterval(() => {
    remainingTime--;
    if (remainingTime <= 0) {
      clearInterval(interval);
    } else {
      timerElement.innerText = `Cooldown: ${remainingTime}s`;
    }
  }, 1000);
}

function startGame() {
  isPlayer_O_Turn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(PLAYER_X_CLASS);
    cell.classList.remove(PLAYER_O_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = isPlayer_O_Turn ? PLAYER_O_CLASS : PLAYER_X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
  } else {
    winningMessageTextElement.innerText = `${
      isPlayer_O_Turn ? "O's" : "X's"
    } Wins!`;
  }
  winningMessageElement.classList.add("show");
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(PLAYER_X_CLASS) ||
      cell.classList.contains(PLAYER_O_CLASS)
    );
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  isPlayer_O_Turn = !isPlayer_O_Turn;
}

function setBoardHoverClass() {
  board.classList.remove(PLAYER_X_CLASS);
  board.classList.remove(PLAYER_O_CLASS);
  if (isPlayer_O_Turn) {
    board.classList.add(PLAYER_O_CLASS);
  } else {
    board.classList.add(PLAYER_X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}
