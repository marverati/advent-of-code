const Array2D = require("./dataStructures/Array2D");

const data1 = `
#############
#...........#
###C#B#A#D###
  #B#C#D#A#
  #########
`

const data2 = `
#############
#...........#
###C#B#A#D###
  #D#C#B#A#  
  #D#B#A#C#  
  #B#C#D#A#  
  #########  
`

const data2test = `
#############
#...........#
###B#C#B#D###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########
`

const energyPerStep = {
    'A': 1,
    'B': 10,
    'C': 100,
    'D': 1000
}

const typeToX = {
    'A': 3,
    'B': 5,
    'C': 7,
    'D': 9
}

const xToType = {
    3: 'A',
    5: 'B',
    7: 'C',
    9: 'D'
}

const roomXs = [3, 5, 7, 9];

const isXInHallForbidden = { 3: true, 5: true, 7: true, 9: true }

const hallY = 1;

function prepareData(data) {
    const lines = data.split("\n").filter(line => line.trim() !== "");
    const map = new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
    return map;
}

function part1() {
    // Did this by hand... :D
    return 11320;
}

function part2(map, positions, pieces) {
    let lowestCost = 50833, steps = 0, deepestMove = Infinity;
    const maxMoves = 70;

    simulate(map, pieces, 0, maxMoves, []);

    return lowestCost;

    function simulate(map, pieces, cost, maxMoves, history) {
        steps++;
        if (maxMoves < deepestMove) {
            deepestMove = maxMoves;
        }
        // if current cost > best found cost, abort
        if (cost >= lowestCost || maxMoves <= 0) {
            return;
        }
        // If we were successful in finding target state, return happily
        if (isComplete(map)) {
            if (cost < lowestCost) {
                lowestCost = cost;
                console.log("Found solution with ", cost);
            }
            return;
        }
        // simulate all possible moves from here
        const moves = getAllMoveOptions(map, pieces, positions);
        for (const move of moves) {
            // Clone data
            const newMap = map.clone();
            const newPieces = pieces.map(p => ({ ... p }));
            const newHistory = history.slice();
            // Perform move
            performMove(newMap, newPieces, move.fromX, move.fromY, move.x, move.y);
            newHistory.push(move);
            // Recursion
            simulate(newMap, newPieces, cost + move.cost, maxMoves - 1, newHistory);
        }
    }
}

function isComplete(map) {
    for (const x of roomXs) {
        const tp = xToType[x];
        for (let y = hallY + 1; y <= bottomY; y++) {
            if (map[y][x] !== tp) {
                return false;
            }
        }
    }
    return true;
}

function getAllMoveOptions(map, pieces) {
    const moves = [];
    for (const p of pieces) {
        const pMoves = getMoveOptions(p, map);
        moves.push( ... pMoves );
    }
    // Lock a tile whenever possible
    const best = moves.find(move => move.score >= 100);
    if (best) {
        return [ best ];
    }
    moves.sort((a, b) => b.score - a.score);
    return moves;
}

function performMove(map, pieces, fromX, fromY, toX, toY) {
    map[toY][toX] = map[fromY][fromX];
    map[fromY][fromX] = '.';
    const piece = pieces.find(p => p.x === fromX && p.y === fromY);
    piece.x = toX;
    piece.y = toY;
}

function getMoveOptions(piece, map) {
    let options = [];
    const visited = new Set();
    const stepCost = energyPerStep[piece.type];

    dfs(piece.x, piece.y, 0, true);

    let ownRoomDirty = false;
    const destX = typeToX[piece.type];
    for (let y = hallY + 1; y <= bottomY; y++) {
        const v = map[y][destX];
        if (v != '.' && v != piece.type) {
            ownRoomDirty = true;
            break;
        }
    }

    // Is locked already?
    if (piece.x === destX && !ownRoomDirty) {
        return [];
    }

    // Follow the rules
    if (piece.y > hallY) {
        // From room, only move into hallway positions or own room
        options = options.filter(op => op.y === hallY || op.x === destX && !ownRoomDirty);
    } else {
        // From hallway, only move into destination room
        // If destination room contains other piece types, nothing to do
        if (ownRoomDirty) {
            return [];
        } else {
            options = options.filter(op => op.y > hallY && op.x === destX && map[op.y + 1][op.x] !== '.');
        }
    }

    // Can lock itself?
    let score = 0;
    if (piece.x !== destX && !ownRoomDirty) {
        const moves = options.filter(op => op.x === destX);
        if (moves.length > 0) {
            moves.sort((a, b) => b.y - a.y);
            options = [moves[0]];
            score = 100;
        }
    }

    // Add information
    const result = options.map(op => ({
        tp: piece.type,
        x: op.x,
        y: op.y,
        fromX: piece.x,
        fromY: piece.y,
        cost: op.steps * stepCost,
        score // heuristical value to speed things up by testing moves in useful order
    }));
    return result;

    function dfs(x, y, steps, ignoreCheck = false) {
        const key = x + 100 * y;
        if (!ignoreCheck) {
            if (map[y][x] !== '.' || visited.has(key)) {
                return;
            }
        }
        // Piece is free
        visited.add(key);
        if (y !== hallY || !isXInHallForbidden[x]) {
            options.push({
                x,
                y,
                steps
            });
        }
        // Recurse
        steps++;
        dfs(x, y - 1, steps);
        dfs(x, y + 1, steps);
        dfs(x - 1, y, steps);
        dfs(x + 1, y, steps);
    }
}


const data = data2;
const map = prepareData(data);
const bottomY = data === data1 ? 3 : 5;
const positions = [], pieces = [];
const positionTypes = ['.', 'A', 'B', 'C', 'D'];
map.forEachCell((v, x, y) => {
    if (positionTypes.includes(v)) {
        positions.push({x, y});
        if (v !== '.') {
            pieces.push({
                type: v,
                x,
                y
            });
        }
    }
});

console.log("Part 1: ", part1());
console.log("Part 2: ", part2(map, positions, pieces));