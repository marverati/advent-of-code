
const data0 = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`

const data = require('./04data');


function handleInput(input) {
    const lines = input.split("\n");
    // Read moves
    const moves = lines[0].split(",").map(v => +(v.trim()));
    // Read boards
    const boards = [];
    for (let i = 2; i < lines.length; i += 6) {
        boards.push(new Board(lines.slice(i, i + 5)));
    }

    // Go through all moves
    let firstWinningSum = null, firstWinningMove = 0, wonBoards = 0, lastWinningMove = 0, lastWinningSum = null;
    for (let i = 0; i < moves.length; i++) {
        for (const board of boards) {
            if (board.applyMove(moves[i])) {
                wonBoards++;
                if (wonBoards === 1) {
                    firstWinningMove = moves[i];
                    firstWinningSum = board.getUnmarkedSum();
                    console.log("First winning board: ", boards.indexOf(board), "- Move: ", firstWinningMove, " - Sum: ", firstWinningSum);
                }
                if (wonBoards === boards.length) {
                    lastWinningMove = moves[i];
                    lastWinningSum = board.getUnmarkedSum();
                    console.log("Last winning board: ", boards.indexOf(board), "- Move: ", lastWinningMove, " - Sum: ", lastWinningSum);
                    break;
                }
            }
        }
        if (lastWinningSum) { break; }
    }
    // Calculate results
    return {
        "first": firstWinningSum * firstWinningMove,
        "last": lastWinningSum * lastWinningMove
    };
}

class Board {
    constructor(rows) {
        this.h = rows.length;
        this.values = [];
        this.marked = [];
        for (let y = 0; y < this.h; y++) {
            this.values[y] = rows[y].split(" ").filter(v => v != "").map(v => +(v.trim()));
            this.marked[y] = this.values[y].map(_ => false);
        }
        this.w = this.values[0].length;
        this.hasWon = false;
    }

    applyMove(move) {
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                if (!this.marked[y][x] && this.values[y][x] === move) {
                    this.marked[y][x] = true;
                    if (this.checkSpot(x, y)) {
                        if (!this.hasWon) {
                            this.hasWon = true;
                            return true;
                        }
                        return false;
                    }
                }
            }
        }
        return false;
    }

    checkSpot(x, y) {
        // Row
        if (this.marked[y].every((v) => v)) {
            return true;
        }
        // Column
        for (let cy = 0; cy < this.h; cy++) {
            if (!this.marked[cy][x]) {
                return false;
            }
        }
        return true;
    }

    getUnmarkedSum() {
        let sum = 0;
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                if (!this.marked[y][x]) { sum += this.values[y][x]; }
            }
        }
        return sum;
    }
}

const result = handleInput(data);
console.log("Result: ", result);