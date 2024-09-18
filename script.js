const board = (function () {
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
            return 1;
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.table(boardWithCellValues);
    }

    return { n, getBoard, clickCell, printBoard };
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

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s
         turn.`);
    }

    const resetBoard = () => {
        let boardArray = board.getBoard();  // Get the 2D array

        // Loop through each row and reset the cell's value to 0
        for (let i = 0; i < boardArray.length; i++) {
            for (let j = 0; j < boardArray[i].length; j++) {
                boardArray[i][j].resetCell();
            }
        }
    }

    const playNewMatch = () => {
        resetBoard();
        moveCount = 0; //resets the moveCount for the nextMatch
        activePlayer = players[0];
        printNewRound();
    }

    const playRound = (row, column) => {
        if (board.clickCell(row, column, getActivePlayer())) {
            moveCount++;
            // check for win

            //check for the win in the row in which the player just marked their mark
            for (let i = 0; i < board.n; i++) {
                if (board.getBoard()[row][i].getValue() != getActivePlayer().mark) {
                    break;
                }
                if (i == (board.n) - 1) {
                    console.log(`${getActivePlayer().name} is the winner.`);
                    playNewMatch();
                    return; //Prevent further execution of the function playRound
                }
            }

            //check for the win in the column in which the player just marked their mark
            for (let i = 0; i < board.n; i++) {
                if (board.getBoard()[i][column].getValue() != getActivePlayer().mark) {
                    break;
                }
                if (i == (board.n) - 1) {
                    console.log(`${getActivePlayer().name} is the winner.`);
                    playNewMatch();
                    return; //Prevent further execution of the function playRound
                }

            }

            //check for win in the diagonal in which the player just marked their mark
            if (row == column) {
                for (i = 0; i < board.n; i++) {
                    if (board.getBoard()[i][i].getValue() != getActivePlayer().mark) {
                        break;
                    }
                    if (i == (board.n) - 1) {
                        console.log(`${getActivePlayer().name} is the winner.`);
                        playNewMatch();
                        return; //Prevent further execution of the function playRound
                    }
                }
            }

            //check for win in the anti-diagonal in which the player just marked their mark
            if (row + column == board.n - 1) {
                for (i = 0; i < board.n; i++) {
                    if (board.getBoard()[i][(board.n - 1) - i].getValue() != getActivePlayer().mark) {
                        break;
                    }
                    if (i == (board.n) - 1) {
                        console.log(`${getActivePlayer().name} is the winner.`);
                        playNewMatch();
                        return; //Prevent further execution of the function playRound
                    }
                }
            }

            if (moveCount == Math.pow(board.n, 2)) {
                console.log("It's a Draw")
                playNewMatch();
                return; //Prevent further execution of the function playRound
            }



            switchPlayerTurn();
            printNewRound();
        }

    }

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const boardArray = board.getBoard();
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
                        cell.textContent = "";
                    }
                    //assigned 'X' for player 1 and 'O' for player 2
                    else if (cell.getValue() == 1) {
                        cell.textContent = "X";
                    }
                    else cell.textContent = "O";
                }

                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        
    }

    updateScreen();
}

ScreenController();