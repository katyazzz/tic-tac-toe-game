const board = document.getElementById('board');
const playFriendButton = document.getElementById('playFriend');
const playRobotButton = document.getElementById('playRobot');
const messageDiv = document.getElementById('message');
let currentPlayer = 'X';
let cells = Array.from({ length: 9 }, () => '');
let gameMode = '';

function checkWin(player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    return winPatterns.some(pattern =>
        pattern.every(index => cells[index] === player)
    );
}

function findBestMove(player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Check if robot can win
    for (let pattern of winPatterns) {
        let count = pattern.filter(index => cells[index] === player).length;
        let empty = pattern.filter(index => cells[index] === '').length;
        if (count === 2 && empty === 1) {
            return pattern.find(index => cells[index] === '');
        }
    }

    // Check if robot needs to block
    const opponent = player === 'O' ? 'X' : 'O';
    for (let pattern of winPatterns) {
        let count = pattern.filter(index => cells[index] === opponent).length;
        let empty = pattern.filter(index => cells[index] === '').length;
        if (count === 2 && empty === 1) {
            return pattern.find(index => cells[index] === '');
        }
    }

    // Take center if available
    if (cells[4] === '') {
        return 4;
    }

    // Take a corner if available
    const corners = [0, 2, 6, 8];
    let availableCorners = corners.filter(index => cells[index] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any empty cell
    let emptyCells = cells.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function handleClick(e) {
    const index = e.target.dataset.index;
    if (cells[index] === '' && (gameMode === 'friend' || (gameMode === 'robot' && currentPlayer === 'X'))) {
        cells[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        if (checkWin(currentPlayer)) {
            setTimeout(() => alert(`${currentPlayer} wins!`), 10);
            setTimeout(resetBoard, 500);
        } else if (!cells.includes('')) {
            setTimeout(() => alert('Draw!'), 10);
            setTimeout(resetBoard, 500);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            messageDiv.textContent = `Current Player: ${currentPlayer}`;
            if (gameMode === 'robot' && currentPlayer === 'O') {
                setTimeout(robotMove, 500);
            }
        }
    }
}

function robotMove() {
    let move = findBestMove('O');
    cells[move] = 'O';
    let cellElement = board.querySelector(`[data-index="${move}"]`);
    cellElement.textContent = 'O';
    if (checkWin('O')) {
        setTimeout(() => alert('O wins!'), 10);
        setTimeout(resetBoard, 500);
    } else if (!cells.includes('')) {
        setTimeout(() => alert('Draw!'), 10);
        setTimeout(resetBoard, 500);
    } else {
        currentPlayer = 'X';
        messageDiv.textContent = `Current Player: ${currentPlayer}`;
    }
}

function resetBoard() {
    cells.fill('');
    board.innerHTML = '';
    createBoard();
}

function createBoard() {
    cells.forEach((_, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = index;
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    });
    currentPlayer = 'X';
    messageDiv.textContent = `Current Player: ${currentPlayer}`;
}

function startGame(mode) {
    gameMode = mode;
    resetBoard();
    playFriendButton.classList.remove('active');
    playRobotButton.classList.remove('active');
    if (mode === 'friend') {
        playFriendButton.classList.add('active');
    } else if (mode === 'robot') {
        playRobotButton.classList.add('active');
    }
}

playFriendButton.addEventListener('click', () => startGame('friend'));
playRobotButton.addEventListener('click', () => startGame('robot'));

createBoard();
