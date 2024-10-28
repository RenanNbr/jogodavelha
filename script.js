let boardSize;
let board;
let currentPlayer;
let gameMode;

document.getElementById('start').addEventListener('click', () => {
    boardSize = parseInt(document.getElementById('size').value);
    gameMode = document.getElementById('mode').value;
    startGame();
});

function startGame() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
    currentPlayer = 'X';
    document.getElementById('board').innerHTML = '';
    document.getElementById('message').textContent = '';
    createBoard();
}

function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => handleCellClick(i, j));
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(row, col) {
    if (board[row][col] || checkWinner()) return;

    board[row][col] = currentPlayer;
    updateBoard();
    
    if (checkWinner()) {
        displayMessage(`Jogador ${currentPlayer} ganhou!`);
        return;
    }
    
    if (isBoardFull()) {
        displayMessage('Empate!');
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    if (gameMode === 'solo' && currentPlayer === 'O') {
        computerMove();
    }
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;
        cell.textContent = board[row][col];
    });
}

function computerMove() {
    const emptyPositions = getEmptyPositions();
    if (emptyPositions.length > 0) {
        const [row, col] = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
        board[row][col] = currentPlayer;
        updateBoard();
        
        if (checkWinner()) {
            displayMessage(`Jogador ${currentPlayer} ganhou!`);
            return;
        }
        
        if (isBoardFull()) {
            displayMessage('Empate!');
            return;
        }
        
        currentPlayer = 'X'; // Volta para o jogador humano
    }
}

function getEmptyPositions() {
    const emptyPositions = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (!board[i][j]) {
                emptyPositions.push([i, j]);
            }
        }
    }
    return emptyPositions;
}

function checkWinner() {
    // Check rows
    for (let i = 0; i < boardSize; i++) {
        if (board[i].every(cell => cell === currentPlayer)) {
            return true;
        }
    }
    
    // Check columns
    for (let i = 0; i < boardSize; i++) {
        if (board.every(row => row[i] === currentPlayer)) {
            return true;
        }
    }
    
    // Check diagonals
    if (board.every((row, i) => row[i] === currentPlayer)) {
        return true;
    }
    
    if (board.every((row, i) => row[boardSize - 1 - i] === currentPlayer)) {
        return true;
    }
    
    return false;
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell));
}

function displayMessage(message) {
    document.getElementById('message').textContent = message;
}