require('./_helpers.js');
const { sample1, sample2, data1 } = require('./15-data.js');
const { assertEqual, logTime } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const dirMap = {
    '>': {x: 1, y: 0},
    '<': {x: -1, y: 0},
    'v': {x: 0, y: 1},
    '^': {x: 0, y: -1},
};

function prepareData(data) {
    const parts = data.split('\n\n');
    return {
        map: parseMap(parts[0]),
        moves: parts[1].replaceAll('\n', '').split('')
    }
    function parseMap(s) {
        const lines = s.split('\n').map(l => l.trim()).filter(l => l != '');
        return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
    }
}

function part1({map, moves}) {
    const robot = map.find(v => v === '@');
    for (const move of moves) {
        const d = dirMap[move];
        // Check if move is possible
        let p = {...robot};
        let steps = 0;
        while (map.isInside(p.x, p.y) && map.get(p.x, p.y) !== '.' && map.get(p.x, p.y) !== '#') {
            p.x += d.x; p.y += d.y;
            steps++;
        }
        if (map.get(p.x, p.y) === '.') {
            // Move backwards
            for (let s = 0; s < steps; s++) {
                map.set(p.x - s * d.x, p.y - s * d.y, map.get(p.x - (s + 1) * d.x, p.y - (s + 1) * d.y));
            }
            map.set(robot.x, robot.y, '.');
            robot.x += d.x;
            robot.y += d.y;
        }
    }
    return map.map((v, x, y) => v === 'O' ? 100 * y + x : 0).reduceCells((v, sum) => v + sum, 0);
}

function part2(data) {
    // Grow map to double its width
    const map = new Array2D(data.map.w * 2, data.map.h, (x, y) => {
        const tile = data.map.get(Math.floor(x / 2), y);
        if (tile === 'O') {
            return x % 2 === 0 ? '[' : ']'
        } else {
            return tile;
        }
    });
    const robot = map.find(v => v === '@');
    map.set(robot.x + 1, robot.y, '.'); // eliminate duplicate robot
    // Perform all possible moves
    for (const move of data.moves) {
        const d = dirMap[move];
        const front = [robot]; // Front of all moved tiles at current step distance
        const toMove = []; // Collection of all tile coordinates that will/would be moved forward (accumulation of all fronts)
        while (true) {
            // Check if whole front can be moved
            if (front.some(p => map.get(p.x + d.x, p.y + d.y) === '#')) {
                break; // Nothing can be moved, abort
            }
            if (front.every(p => map.get(p.x + d.x, p.y + d.y) === '.')) {
                // Success, move all accumulated front tiles forward in given direction
                toMove.push(...front);
                for (let i = toMove.length - 1; i >= 0; i--) {
                    const p = toMove[i];
                    map.set(p.x + d.x, p.y + d.y, map.get(p.x, p.y));
                    map.set(p.x, p.y, '.');
                }
                robot.x += d.x;
                robot.y += d.y;
                break;
            }
            // We don't know yet if things can be moved; update front step by step
            const newFront = front.map(p => ({x: p.x + d.x, y: p.y + d.y})).filter(p => map.get(p.x, p.y) !== '.');
            // Grow front to take full boxes into account, in case we're moving vertically
            if (d.y !== 0) {
                for (let f = 0; f < newFront.length; f++) {
                    const p = newFront[f];
                    const prev = newFront[f - 1] ?? {x:-1, y:-1};
                    const next = newFront[f + 1] ?? {x:-1, y:-1};
                    if (map.get(p.x, p.y) === '[' && !(next.x === p.x + 1 && next.y === p.y)) {
                        // Add right side of box
                        newFront.splice(f + 1, 0, {x: p.x + 1, y: p.y});
                        f++; // skip that one in check
                    } else if (map.get(p.x, p.y) === ']' && !(prev.x === p.x - 1 && prev.y === p.y)) {
                        // Add left side of box
                        newFront.splice(f, 0, {x: p.x - 1, y: p.y});
                        f++; // skip that one in check
                    }
                }
            }
            // Prepare for next step: accumulate previous front to toMove, and work on with new front
            toMove.push(...front.splice(0, front.length));
            front.push(...newFront);
        }
    }
    return map.map((v, x, y) => v === '[' ? 100 * y + x : 0).reduceCells((v, sum) => v + sum, 0);
}


const sampleData = () => prepareData(sample1);
assertEqual("Part 1 works with example", part1(sampleData()), 10092);
assertEqual("Part 2 works with example", part2(sampleData()), 9021);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));