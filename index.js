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

        // for (let combo = 0; combo < winningCombos.length; combo++) {
        //     let [first, second, third] = winningCombos[combo];

        //     if ((currentBoard[first] === currPlayerMark) && (currentBoard[second] === currPlayerMark) && (currentBoard[third] == currPlayerMark)) {
        //         return true; 
        //     } 
        // }
        // return false;

        return winningCombos.some(combo => combo.every(index => currentBoard[index] === currPlayerMark))
    }

    const getCurrentPlayer = () => {
        return currentPlayer;
    };

    const isGameOver = () => {
        return (checkWin(player1.mark) || checkWin(player2.mark) || Gameboard.isFull());
    }

    const getWinner = () => {
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