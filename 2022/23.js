require('./_helpers.js');
const { data0, data1 } = require('./23data');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    const elves = [];
    const map = {};
    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            if (lines[y][x] === '#') {
                elves.push({x: x , y: y});
                map[getKey(x, y)] = elves.last;
            }
        }
    }
    return { map, elves };
}

function getKey(x, y) {
    return `${x},${y}`;
}

const allNeighborOffsets = [ [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1] ];

function simulate({ map, elves }, rounds) {
    const dirs = [
        {dx: 0, dy: -1}, // N
        {dx: 0, dy: 1}, // S
        {dx: -1, dy: 0}, // W
        {dx: 1, dy: 0}, // E
    ];

    // Simulate rounds
    for (let round = 0; round !== rounds; round++) {
        // First half: consider where to move
        const targets = {};
        for (const e of elves) {
            e.target = null;
            const trg = getTarget(e, dirs);
            if (trg) {
                const key = trg.x + "," + trg.y;
                // Only move if no other elve planned to move there
                if (!targets[key]) {
                    e.target = trg;
                    targets[key] = e;
                } else {
                    targets[key].target = null;
                }
            }
        }
        // Second half: move
        let moves = 0;
        for (const e of elves) {
            if (e.target) {
                map[getKey(e.x, e.y)] = null;
                e.x = e.target.x;
                e.y = e.target.y;
                map[getKey(e.x, e.y)] = e;
                moves++;
            }
        }
        // Part 2: Check if no elve moved in this round
        if (rounds < 0 && moves === 0) {
            return round + 1;
        }
        // Switch order of checked directions for following round
        dirs.push(dirs.shift());
    }

    // Part 1: Count empty ground tiles
    const xs = elves.map(e => e.x), ys = elves.map(e => e.y);
    const w = xs.max() - xs.min() + 1, h = ys.max() - ys.min() + 1;
    const emptyTiles = w * h - elves.length;

    return emptyTiles;

    function getTarget(elve, dirs) {
        const x = elve.x, y = elve.y;
        // Do nothing if no elve nearby
        let hasNb = false;
        for (const offset of allNeighborOffsets) {
            const nx = x + offset[0], ny = y + offset[1];
            if (map[getKey(nx, ny)] != null) {
                hasNb = true;
                break;
            }
        }
        if (!hasNb) {
            return null;
        }
        // Otherwise, check 4 directions in appropriate order, and look if 3 empty tiles are adjacent in that direction
        for (const { dx, dy } of dirs) {
            const ox = dy, oy = -dx; // orthogonal to {dx,dy}
            const nx = x + dx, ny = y + dy;
            if (!map[getKey(nx, ny)] && !map[getKey(nx + ox, ny + oy)] && !map[getKey(nx - ox, ny - oy)]) {
                return { x: nx, y: ny };
            }
        }
        // All directions occupied -> don't move
        return null;
    }
}

const source = data1;
console.log("Part 1: ", simulate(prepareData(source), 10));
console.log("Part 2: ", simulate(prepareData(source), -1));