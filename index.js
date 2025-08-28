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