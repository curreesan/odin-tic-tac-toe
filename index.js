const Gameboard = (function() {
    let board = Array(9).fill('');

    const getBoard = () => [...board];

    const placeMark = (index, mark) => {
        if ((index >= 0 && index < 9) && board[index] === '' && (mark === 'X' || mark === 'O')) {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const isFull = () => board.every(cell => cell != '');

    const reset = () => {
        board = Array(9).fill('');
    };

    return {getBoard, placeMark, isFull, reset};
})();

const Player = (name, mark) => {
    return {name, mark};
};

const GameController = (function() {
    const winningCombos = [[0,1,2], [3,4,5], [6,7,8],[0,3,6], [1,4,7], [2,5,8],[0,4,8], [2,4,6]];
    let player1, player2, currentPlayer;

    const startGame =  (player1Name, player2Name) => {

        player1 = Player(player1Name, 'X');
        player2 = Player(player2Name, 'O');
        
        currentPlayer = player1;

        Gameboard.reset();
    }

    const playTurn = (playIndex) => {
        let gameMove = Gameboard.placeMark(playIndex, currentPlayer.mark);

        if (gameMove) {
            // check win 
            if (checkWin(currentPlayer.mark)) {
                return "win";
            
            // check tie (board full/ tie)
            } else if (Gameboard.isFull()){
                return "tie";

            // neither, continue game aka switch player
            } else {
                currentPlayer = (currentPlayer === player1) ? player2 : player1;
                return "continue";
            }
        }
        // if invalid then failure msg
        return "invalid";

    }

    const checkWin = (currPlayerMark) => {
        let currentBoard = Gameboard.getBoard();
        return winningCombos.some(combo => combo.every(index => currentBoard[index] === currPlayerMark))
    }

    const getCurrentPlayer = () => {
        return currentPlayer;
    };

    const isGameOver = () => {
        return (checkWin(player1.mark) || checkWin(player2.mark) || Gameboard.isFull());
    }

    const getWinner = () => {
       if (!player1 || !player2) return null;

       if (checkWin(player1.mark)) {
        return player1;
       } else if (checkWin(player2.mark)) {
        return player2;
       } else if (Gameboard.isFull()) {
        return "tie";
       } else return null;
    }

    return {startGame, playTurn, getCurrentPlayer, isGameOver, getWinner}
})();

const DisplayController = (function() {
    // DOM references and game state in IIFE scope
    let startButton, resetButton, playerXInput, playerOInput, gameContainer, gameStatus;
    let gameActive = false;

    // Initialize DOM elements and event listeners
    const init = () => {
        startButton = document.querySelector('.start');
        resetButton = document.querySelector('.reset');
        playerXInput = document.querySelector('.x-player-name');
        playerOInput = document.querySelector('.o-player-name');
        gameContainer = document.querySelector('.game-container');
        gameStatus = document.querySelector('.game-status');

        // Attach event listeners
        startButton.addEventListener('click', handleStartGame);
        resetButton.addEventListener('click', handleResetGame);
        gameContainer.addEventListener('click', handleCellClick);

        // Initial render and status
        renderBoard();
        updateStatus();
    };

    // Render the gameboard to the DOM
    const renderBoard = () => {
        const board = Gameboard.getBoard();
        const cells = gameContainer.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = board[index]; // Display X, O, or empty
        });
    };

    // Handle cell clicks using event delegation
    const handleCellClick = (event) => {
        if (!event.target.classList.contains('cell') || !gameActive) return;

        const index = parseInt(event.target.getAttribute('data-cell-number'));
        const result = GameController.playTurn(index);

        if (result === 'invalid') {
            // Show temporary feedback for invalid move
            gameStatus.textContent = 'Cell already taken!';
            setTimeout(updateStatus, 1000); // Revert to normal status after 1 second
            return;
        }

        if (result === 'win' || result === 'tie') {
            gameActive = false;
            playerXInput.disabled = false;
            playerOInput.disabled = false;
        }

        renderBoard();
        updateStatus();
    };

    // Start a new game
    const handleStartGame = () => {
        const player1Name = playerXInput.value.trim() || 'Player X';
        const player2Name = playerOInput.value.trim() || 'Player O';

        GameController.startGame(player1Name, player2Name);
        gameActive = true;
        playerXInput.disabled = true;
        playerOInput.disabled = true;

        renderBoard();
        updateStatus();
    };

    // Reset the game
    const handleResetGame = () => {
        const player1Name = playerXInput.value.trim() || 'Player X';
        const player2Name = playerOInput.value.trim() || 'Player O';

        GameController.startGame(player1Name, player2Name);
        gameActive = true;
        playerXInput.disabled = true;
        playerOInput.disabled = true;

        renderBoard();
        updateStatus();
    };

    // Update the game status message
    const updateStatus = () => {
        if (!gameActive) {
            const winner = GameController.getWinner();
            if (winner === 'tie') {
                gameStatus.textContent = "It's a tie!";
            } else if (winner) {
                console.log(winner);
                gameStatus.textContent = `${winner.name} (${winner.mark}) wins!`;
            } else {
                gameStatus.textContent = 'Enter names to start!';
            }
        } else {
            const currentPlayer = GameController.getCurrentPlayer();
            gameStatus.textContent = `${currentPlayer.name}'s turn (${currentPlayer.mark})`;
        }
    };

    return { init };
})();

DisplayController.init();