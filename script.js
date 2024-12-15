const cardValues = [
    '❄️', '❄️', '🎄', '🎄', '🤶', '🤶', '⛄', '⛄',
    '🎁', '🎁', '🦌', '🦌', '🎅', '🎅', '🎈', '🎈'
];

let firstCard = null;
let secondCard = null;
let score = 0;
let timer = 100;
let intervalId;

const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restartButton');

if(document.readystate === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
    createBoard();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('visible')); 
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            restartGame();
        });
    });
}



function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    shuffle(cardValues);
    grid.innerHTML = '';
    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (this.classList.contains('flipped') || secondCard) return;
    
    this.classList.add('flipped');
    this.textContent = this.dataset.value;

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        score++;
        scoreDisplay.textContent = score;
        if(document.getElementsByClassName('matched').length == 16) {
            clearInterval(intervalId);
            document.getElementById('Victory-text').classList.add('visible');
        }
        resetCards();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.classList.remove('flipped');
            secondCard.textContent = '';
            resetCards();
        }, 1000);
    }
}

function resetCards() {
    firstCard = null;
    secondCard = null;
}

function startTimer() {
    intervalId = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;
        if (timer <= 0) {
            clearInterval(intervalId);
            // alert('Time up! Your score: ' + score);
            disableCards();
            document.getElementById('scored').innerHTML = "Score: " + score;
            document.getElementById('game-over-text').classList.add('visible');
        }
    }, 1000);
}

function disableCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.removeEventListener('click', flipCard);
    });
}

function restartGame() {
    clearInterval(intervalId);
    resetCards();
    timer = 100;
    score = 0;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timer;
    startTimer();
    createBoard();
}

restartButton.addEventListener('click', restartGame);
// Start the game on page load