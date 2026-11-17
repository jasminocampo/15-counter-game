const startingCounters = 15;
let counters = startingCounters;
let gameOver = false;

const remainingEl = document.getElementById('remaining');
const pileEl = document.getElementById('counter-pile');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const takeButtons = document.querySelectorAll('.take-button');
const restartButton = document.getElementById('restart');

function render() {
  remainingEl.textContent = counters;
  pileEl.innerHTML = '';
  for (let i = 0; i < counters; i++) {
    const counter = document.createElement('span');
    counter.className = 'counter';
    pileEl.appendChild(counter);
  }
  takeButtons.forEach(button => {
    const amount = Number(button.dataset.take);
    button.disabled = gameOver || amount > counters;
  });
}

function finish(winner) {
  gameOver = true;
  statusEl.textContent = 'The round is complete.';
  resultEl.hidden = false;
  resultEl.textContent = winner === 'player' ? 'You won! Well played.' : 'Computer wins this round.';
  render();
}

function computerTurn() {
  if (counters <= 0 || gameOver) return;

  // Try to leave a multiple of 4 for the player.
  let computerTakes = counters % 4;
  if (computerTakes === 0) computerTakes = 1;
  computerTakes = Math.min(computerTakes, 3, counters);

  statusEl.textContent = `Computer is thinking...`;
  takeButtons.forEach(button => button.disabled = true);

  window.setTimeout(() => {
    counters -= computerTakes;
    render();

    if (counters === 0) {
      finish('computer');
    } else {
      statusEl.textContent = `Computer took ${computerTakes}. Your turn!`;
      render();
    }
  }, 650);
}

function playerTurn(amount) {
  if (gameOver || amount < 1 || amount > 3 || amount > counters) return;

  counters -= amount;
  render();

  if (counters === 0) {
    finish('player');
    return;
  }

  statusEl.textContent = `You took ${amount}. Computer's turn...`;
  computerTurn();
}

takeButtons.forEach(button => {
  button.addEventListener('click', () => playerTurn(Number(button.dataset.take)));
});

restartButton.addEventListener('click', () => {
  counters = startingCounters;
  gameOver = false;
  resultEl.hidden = true;
  resultEl.textContent = '';
  statusEl.textContent = 'Your turn. Choose how many counters to take.';
  render();
});

render();
