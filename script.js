const Board = (function () {
    const n = 3;
    const board = [];

    for (let i = 0; i < n; i++) {
        board[i] = [];
        for (let j = 0; j < n; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const clickCell = (row, column, player) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].markCell(player.mark);
            return true;
        }
        return false;
    }

    const resetBoard = () => {
        board.forEach(row => row.forEach(cell => cell.resetCell()));
    };

    //this is for console so will be removed
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.table(boardWithCellValues);
    }
    //
    return { n, getBoard, clickCell, printBoard, resetBoard };
})();

function Cell() {
    let value = 0;

    const markCell = (playerMark) => {
        value = playerMark;
    };

    const getValue = () => value;

    const resetCell = () => {
        value = 0;
    }

    return { markCell, getValue, resetCell };
}

function GameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    let moveCount = 0;
    const players = [
        {
            name: playerOneName,
            mark: 1
        },
        {
            name: playerTwoName,
            mark: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer ===
            players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    //this can also be removed as this is for console
    const printNewRound = () => {
        Board.printBoard();
        console.log(`${getActivePlayer().name}'s
         turn.`);
    }
    //

    const checkWin = (row, column) => {
        const board = Board.getBoard();
        const n = Board.n;
        const playerMark = activePlayer.mark;

        //check row 
        for (let i = 0; i < n; i++) {
            if (board[row][i].getValue() != playerMark) {
                break;
            }
            if (i == n - 1) {
                //for the console
                console.log(`${getActivePlayer().name} is the winner.`);
                //
                return true;
            }
        }

        //check column
        for (let i = 0; i < n; i++) {
            if (board[i][column].getValue() != playerMark) {
                break;
            }
            if (i == n - 1) {
                //for the console
                console.log(`${getActivePlayer().name} is the winner.`);
                //
                return true;
            }

        }

        //check diagonal
        if (row == column) {
            for (let i = 0; i < n; i++) {
                if (board[i][i].getValue() != playerMark) {
                    break;
                }
                if (i == n - 1) {
                    //for the console
                    console.log(`${getActivePlayer().name} is the winner.`);
                    //
                    return true;
                }
            }
        }

        //check anti-diagonal
        if (row + column == n - 1) {
            for (let i = 0; i < n; i++) {
                if (board[i][(n - 1) - i].getValue() != playerMark) {
                    break;
                }
                if (i == n - 1) {
                    //for the console
                    console.log(`${getActivePlayer().name} is the winner.`);
                    return true;
                }
            }
        }


    }

    const checkDraw = () => {
        if (moveCount == Math.pow(Board.n, 2)) {
            //for the console
            console.log("It's a Draw")

            return true; //Prevent further execution of the function playRound
        }
    }


    const playRound = (row, column) => {
        if (Board.clickCell(row, column, getActivePlayer())) {
            moveCount++;
            if (checkWin(+row, +column)) {
                return { status: 'win', player: getActivePlayer() };
            }
            if (checkDraw()) {
                return { status: 'draw' };
            }
            switchPlayerTurn();
            return { status: 'ongoing', player: getActivePlayer() };

            printNewRound(); //for the console
        };
        return { status: 'invalid' };
    };


    const resetGame = () => {
        Board.resetBoard();
        moveCount = 0; //resets the moveCount for the nextMatch
        activePlayer = players[0];
        printNewRound(); //for the console
    };

    printNewRound(); //for the console

    return {
        playRound,
        getActivePlayer,
        resetGame
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const winnerDiv = document.querySelector('.win-screen');
    const announcementDiv = winnerDiv.querySelector('.announcement-card');
    const restartButton = winnerDiv.querySelector('.restart')

    restartButton.addEventListener('click', () => {
        hideWinner();
        game.resetGame();
        updateScreen();
    })

    const updateScreen = () => {
        boardDiv.textContent = "";

        const boardArray = Board.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        boardArray.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;

                {
                    if (cell.getValue() == 0) {
                        cellButton.textContent = "";
                    }
                    //assigned 'X' for player 1 and 'O' for player 2
                    else if (cell.getValue() == 1) {
                        cellButton.textContent = "X";
                        cellButton.classList.add('cross');
                    }
                    else {
                        cellButton.textContent = "O";
                        cellButton.classList.add('circle');
                    }
                }

                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const rowIndex = e.target.dataset.row;
        const colIndex = e.target.dataset.column;

        gameStatus = game.playRound(rowIndex, colIndex);
        if (gameStatus.status == 'win' || gameStatus.status == 'draw') {
            showWinner();
            if(gameStatus.status =='win'){
                announcementDiv.textContent = `${gameStatus.player.name} is the winner.`
            }
            else if(gameStatus.status == 'draw') {
                announcementDiv.textContent = "It's a Draw"
             }
        }
        updateScreen();
    }

    function showWinner() {
        document.body.appendChild(winnerDiv);
    }

    function hideWinner() {
        winnerDiv.remove();
    }




    boardDiv.addEventListener('click', clickHandlerBoard);
    updateScreen();
    hideWinner();

}

ScreenController();