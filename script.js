function Gameboard() {
    const n = 3;
    const board = [];

    for (let i = 0; i < n; i++) {
        board[i] = [];
        for (let j = 0; j < n; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const clickCell = (row, column, playerMark) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].markCell(playerMark);
            return 1;
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.table(boardWithCellValues);
    }

    return { n, getBoard, clickCell, printBoard };
}

function Cell() {
    let value = 0;

    const markCell = (playerMark) => {
        value = playerMark;
    };

    const getValue = () => value;

    return { markCell, getValue };
}

function GameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const board = Gameboard();
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

    const playRound = (row, column) => {
        if (board.clickCell(row, column, getActivePlayer().mark)) {
            moveCount++;
            // check for win

            //check for the win in the row in which the player just marked their mark
            for (let i = 0; i < board.n; i++) {
                if (board.getBoard()[row][i].getValue() != getActivePlayer().mark) {
                    break;
                }
                if (i == (board.n) - 1) {
                    console.log(`${getActivePlayer().name} is the winner.`)
                }
            }

            //check for the win in the column in which the player just marked their mark
            for (let i = 0; i < board.n; i++) {
                if (board.getBoard()[i][column].getValue() != getActivePlayer().mark) {
                    break;
                }
                if (i == (board.n) - 1) {
                    console.log(`${getActivePlayer().name} is the winner.`)
                }

            }

            //check for win in the diagonal in which the player just marked their mark
            if (row == column) {
                for (i = 0; i < board.n; i++) {
                    if (board.getBoard()[i][i].getValue() != getActivePlayer().mark) {
                        break;
                    }
                    if (i == (board.n) - 1) {
                        console.log(`${getActivePlayer().name} is the winner.`)
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
                        console.log(`${getActivePlayer().name} is the winner.`)
                    }
                }
            }

            if(moveCount == Math.pow(board.n,2)){
                console.log("It's a Draw")
            }



            switchPlayerTurn();
            printNewRound();
        }

    }

    printNewRound();

    return {
        playRound, getActivePlayer
    };
}

const game = GameController();