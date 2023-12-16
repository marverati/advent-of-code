require('./_helpers.js');
const { data1 } = require('./16-data.js');
const { logTime, logProgress } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0 = String.raw`
.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....
`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

function part1(data, x = 0, y = 0, dx = 1, dy = 0) {
    const beams = data.map(() => 0);
    const started = {};

    computeBeam(x, y, dx, dy);

    return beams.reduceCells((current, v) => current + (v > 0 ? 1 : 0), 0);

    function computeBeam(x, y, dx, dy) {
        const hash = `${x},${y},${dx},${dy}`;
        if (started[hash]) {
            // Avoid infinite loops by walking each path only once
            return;
        }
        started[hash] = true;
        while(data.isInside(x, y)) {
            const cell = data[y][x];
            // Count energization
            beams[y][x]++;
            // Change direction?
            if (cell === '|' || cell === '-') {
                const ignore = (cell === '-') === (dy === 0);
                if (!ignore) {
                    const tmp = dx;
                    dx = -dy;
                    dy = tmp;
                    // Spawn recursive path in opposite directions
                    computeBeam(x-dx, y-dy, -dx, -dy);
                    computeBeam(x+dx, y+dy, dx, dy);
                    return;
                }
            } else if (cell === '/' || cell === '\\') {
                // \ or / direction change
                if (dy === 0) {
                    // horizontal
                    const down = (dx > 0) === (cell === '\\');
                    dx = 0;
                    dy = down ? 1 : -1;
                } else {
                    // vertical
                    const right = (dy > 0) === (cell === '\\');
                    dx = right ? 1 : -1;
                    dy = 0;
                }
            }
            // Move on
            x += dx;
            y += dy;
        }
    }
}

function part2(data) {
    let best = 0;
    for (let x = 0; x < data.w; x++) {
        best = Math.max(
            best,
            part1(data, x, 0, 0, 1),
            part1(data, x, data.h1, 0, -1)
        );
    }
    for (let y = 0; y < data.h; y++) {
        best = Math.max(
            best,
            part1(data, 0, y, 1, 0),
            part1(data, data.w1, y, -1, 0)
        );
    }
    return best;
}


const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));