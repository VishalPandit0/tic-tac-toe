const board = ['', '', '', '', '', '', '', '', ''];
const players = ['X', 'O'];
let currentPlayer = players[0];
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

function playerMove(index) {
    if (board[index] === '') {
        board[index] = currentPlayer;
        render();
        if (checkWinner(currentPlayer)) {
            setTimeout(() => {
                alert(currentPlayer + ' wins!');
                resetGame();
            }, 100);
            return;
        }
        if (board.every(cell => cell !== '')) {
            setTimeout(() => {
                alert('It\'s a draw!');
                resetGame();
            }, 100);
            return;
        }
        currentPlayer = players[(players.indexOf(currentPlayer) + 1) % players.length];
        if (currentPlayer === 'O') {
            setTimeout(() => botMove(), 100);
        }
    }
}

function botMove() {
    const bestMove = getBestMove();
    playerMove(bestMove.index);
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = players[1];
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return { index: move };
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner(players[0]) ? -1 :
        checkWinner(players[1]) ? 1 :
        board.every(cell => cell !== '') ? 0 : null;

    if (result !== null) {
        return result;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = players[1];
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = players[0];
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(player) {
    const result = WINNING_COMBINATIONS.find(combination =>
        combination.every(index => board[index] === player)
    );
    if (result) {
        displayWinningCombination(result);
        return true;
    }
    return false;
}

function displayWinningCombination(combination) {
    combination.forEach(index => {
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.style.backgroundColor = '#ffc107';
    });
}

function resetGame() {
    board.fill('');
    currentPlayer = players[0];
    render();
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.backgroundColor = '#ffffff';
    });
}

function render() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        cell.setAttribute('data-index', index);
    });
}