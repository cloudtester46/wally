const gameArea = document.querySelector('#gameArea');
const startButton = document.querySelector('#startButton');
const scoreText = document.querySelector('#score');
const roundText = document.querySelector('#round');
const bestText = document.querySelector('#best');
const message = document.querySelector('#message');
const wally = document.querySelector('#wally');
const guessMarker = document.querySelector('#guessMarker');

const totalRounds = 5;
let score = 0;
let round = 1;
let bestTap = 0;
let target = { x: 50, y: 50 };
let gameStarted = false;
let waitingForNextRound = false;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function placeWally() {
  target = {
    x: randomBetween(8, 92),
    y: randomBetween(30, 88),
  };

  wally.style.left = `${target.x}%`;
  wally.style.top = `${target.y}%`;
  wally.classList.remove('found');
  gameArea.classList.remove('show-wally');
  guessMarker.classList.remove('show');
}

function updateScreen() {
  scoreText.textContent = String(score);
  roundText.textContent = String(round);
  bestText.textContent = bestTap > 0 ? String(bestTap) : '—';
}

function startGame() {
  score = 0;
  round = 1;
  bestTap = 0;
  gameStarted = true;
  waitingForNextRound = false;
  startButton.textContent = 'Restart game';
  message.textContent = 'Tap where you think Wally is hiding.';
  placeWally();
  updateScreen();
}

function getTapPlace(event) {
  const box = gameArea.getBoundingClientRect();
  const x = ((event.clientX - box.left) / box.width) * 100;
  const y = ((event.clientY - box.top) / box.height) * 100;

  return { x, y };
}

function getPoints(tap) {
  const xGap = tap.x - target.x;
  const yGap = tap.y - target.y;
  const distance = Math.sqrt(xGap * xGap + yGap * yGap);
  return Math.max(0, Math.round(100 - distance * 3));
}

function nextRound() {
  waitingForNextRound = false;

  if (round >= totalRounds) {
    gameStarted = false;
    gameArea.classList.add('show-wally');
    message.textContent = `Game over! You scored ${score}. Press restart to play again.`;
    return;
  }

  round += 1;
  placeWally();
  updateScreen();
  message.textContent = 'New hiding spot. Tap your next guess.';
}

function makeGuess(event) {
  if (!gameStarted || waitingForNextRound) {
    return;
  }

  const tap = getTapPlace(event);
  const points = getPoints(tap);
  score += points;
  bestTap = Math.max(bestTap, points);
  waitingForNextRound = true;

  guessMarker.style.left = `${tap.x}%`;
  guessMarker.style.top = `${tap.y}%`;
  guessMarker.classList.add('show');
  wally.classList.add('found');

  updateScreen();

  if (points >= 90) {
    message.textContent = `Amazing! ${points} points. You were very close!`;
  } else if (points >= 60) {
    message.textContent = `Nice! ${points} points. Pretty close!`;
  } else if (points >= 25) {
    message.textContent = `${points} points. Not bad. Try closer next time!`;
  } else {
    message.textContent = `${points} points. Wally was far from there!`;
  }

  window.setTimeout(nextRound, 1400);
}

startButton.addEventListener('click', startGame);
gameArea.addEventListener('click', makeGuess);
gameArea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    const box = gameArea.getBoundingClientRect();
    makeGuess({ clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 });
  }
});

updateScreen();
