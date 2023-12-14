require('./_helpers.js');
const { data0, data1 } = require('./14-data.js');
const { logTime, logProgress } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    const map = new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
    return map;
}

/** Counts load on north on the fly without modifying the map */
function countLoadAfterNorthTilt(map) {
    let result = 0;
    for (let x = 0; x < map.w; x++) {
        let currentWeight = map.h;
        let sum = 0;
        for (let y = 0; y < map.h; y++) {
            const yWeight = map.h - y;
            if (map[y][x] === '#') {
                currentWeight = yWeight - 1;
            } else if (map[y][x] === 'O') {
                sum += currentWeight;
                currentWeight--;
            }
        }
        result += sum;
    }
    return result;
}

/** Counts load on north for the map as is */
function countLoad(map) {
    let result = 0;
    for (let y = 0; y < map.h; y++) {
        const weight = map.h - y;
        for (let x = 0; x < map.w; x++) {
            if (map[y][x] === 'O') {
                result += weight;
            }
        }
    }
    return result;
}

function part1(map) {
    return countLoadAfterNorthTilt(map);
}

function part2(map) {
    const results = [];
    const maps = [];
    for (let i = 0; i < 1000000000; i++) { // <- will not iterate through the full loop, because we hope to find a cycle before that
        performCycle(map);
        results.push(countLoad(map));
        maps.push(map.toString((c) => c, '', ''));
        // Find cycle
        for (let j = i - 1; j >= 0; j--) {
            if (results[j] === results[i] && maps[j] === maps[i]) {
                // Cycle found, predict final result based on cycle and return
                const cycleLength = i - j;
                const remaining = 1000000000 - i - 1;
                const cyclePos = remaining % cycleLength;
                const resultIndex = j + cyclePos;
                return results[resultIndex];
            }
        }
    }
    return results.last;
}

function performCycle(map) {
    for (const d of [[0, -1], [-1, 0], [0,1], [1,0]]) {
        performMove(map, d);
    }
}

function performMove(map, d) {
    const x0 = d[0] <= 0 ? 0 : map.w - 1;
    const y0 = d[1] <= 0 ? 0 : map.h - 1;
    const x1 = d[0]  > 0 ? -1 : map.w;
    const y1 = d[1]  > 0 ? -1 : map.h;
    if (d[0] === 0) {
        // Vertical
        for (let x = 0; x < map.w; x++) {
            let lastStable = y0;
            for (let y = y0; y !== y1; y -= d[1]) {
                if (map[y][x] === "O") {
                    if (map[lastStable][x] === ".") {
                        map[lastStable][x] = "O";
                        map[y][x] = ".";
                    }
                    lastStable = lastStable - d[1];
                } else if (map[y][x] === "#") {
                    lastStable = y - d[1];
                }
            }
        }
    } else {
        // Horizontal
        for (let y = 0; y < map.h; y++) {
            let lastStable = x0;
            for (let x = x0; x !== x1; x -= d[0]) {
                if (map[y][x] === "O") {
                    if (map[y][lastStable] === '.') {
                        map[y][lastStable] = "O";
                        map[y][x] = ".";
                    }
                    lastStable = lastStable - d[0];
                } else if (map[y][x] === "#") {
                    lastStable = x - d[0];
                }
            }
        }
    }
}

const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));