
const homeScreen = document.getElementById("home-screen");
const instructionsScreen = document.getElementById("instructions-screen");
const turnScreen = document.getElementById("turn-screen");
const gameScreen = document.getElementById("game-screen");

const flowerPile = document.getElementById("flower-pile");
const remainingText = document.getElementById("remaining");
const statusText = document.getElementById("status");
const resultText = document.getElementById("result");

let flowers = 15;
let gameOver = false;
let computerTurn = false;

function showScreen(screen) {
    homeScreen.hidden = true;
    instructionsScreen.hidden = true;
    turnScreen.hidden = true;
    gameScreen.hidden = true;

    screen.hidden = false;
}

document.getElementById("how-to-play").onclick = () => {
    showScreen(instructionsScreen);
};

document.getElementById("play-button").onclick = () => {
    showScreen(turnScreen);
};

document.getElementById("back-home").onclick = () => {
    showScreen(homeScreen);
};

document.getElementById("play-now").onclick = () => {
    showScreen(turnScreen);
};

function updateGarden() {
    remainingText.textContent = flowers;
    flowerPile.innerHTML = "";

    for (let i = 0; i < flowers; i++) {
        const flower = document.createElement("span");
        flower.className = "flower";
        flower.textContent = "🌸";
        flowerPile.appendChild(flower);
    }
}

function startGame(playerStarts) {
    flowers = 15;
    gameOver = false;
    computerTurn = !playerStarts;

    showScreen(gameScreen);
    resultText.hidden = true;

    updateGarden();

    if (playerStarts) {
        statusText.textContent = "Your turn! Pick your flowers.";
        enableButtons(true);
    } else {
        statusText.textContent = "Computer is picking first...";
        enableButtons(false);
        setTimeout(computerMove, 1000);
    }
}

document.getElementById("player-first").onclick = () => {
    startGame(true);
};

document.getElementById("computer-first").onclick = () => {
    startGame(false);
};

function enableButtons(enabled) {
    document.querySelectorAll(".take-button").forEach(button => {
        const amount = Number(button.dataset.take);

        button.disabled = !enabled || gameOver || amount > flowers;
    });
}

document.querySelectorAll(".take-button").forEach(button => {
    button.onclick = () => {
        if (gameOver || computerTurn) return;

        const amount = Number(button.dataset.take);

        if (amount > flowers) return;

        flowers -= amount;
        updateGarden();

        if (flowers === 0) {
            endGame("You picked the last flower. You win!");
            return;
        }

        computerTurn = true;
        statusText.textContent = "Computer is picking...";
        enableButtons(false);

        setTimeout(computerMove, 1000);
    };
});

function computerMove() {
    if (gameOver) return;

    let amount = flowers % 4;

    if (amount === 0) {
        amount = Math.min(1, flowers);
    }

    amount = Math.min(amount, 3, flowers);

    flowers -= amount;
    updateGarden();

    if (flowers === 0) {
        endGame("Computer picked the last flower. Computer wins!");
        return;
    }

    computerTurn = false;
    statusText.textContent =
        "Computer picked " + amount + " flower(s). Your turn!";

    enableButtons(true);
}

function endGame(message) {
    gameOver = true;
    computerTurn = false;

    statusText.textContent = "The garden game is over!";
    resultText.textContent = message;
    resultText.hidden = false;

    enableButtons(false);
}

document.getElementById("restart").onclick = () => {
    flowers = 15;
    gameOver = false;
    computerTurn = false;
    showScreen(turnScreen);
};

updateGarden();
