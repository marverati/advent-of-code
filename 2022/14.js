require('./_helpers.js');
const { data0, data1 } = require('./14data');
const Array2D = require('./dataStructures/Array2D.js');
const { deepCopy } = require('./_util.js');

const AIR = '.';
const ROCK = '#';
const SAND = 'o';

let lowestRock = 0;

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    const map = new Array2D(850, 200, (x, y) => AIR);
    // Follow rock paths
    for (const line of lines) {
        const coords = line.split(' -> ').map(c => c.split(',').map(v => +v));
        for (let i = 1; i < coords.length; i++) {
            const xs = coords[i][0] > coords[i - 1][0] ? 1 : -1;
            const ys = coords[i][1] > coords[i - 1][1] ? 1 : -1;
            for (let x = coords[i - 1][0]; x !== coords[i][0] + xs; x += xs) {
                for (let y = coords[i - 1][1]; y !== coords[i][1] + ys; y += ys) {
                    map.set(x, y, ROCK);
                    if (y > lowestRock) { lowestRock = y; }
                }
            }
        }
    }
    return map;
}

function part1(map) {
    let count = 0;
    while (simulateSand(map, 500, 0, lowestRock + 1)) {
        count++;
    }
    return count;
}

function part2(map) {
    // Add ground
    for (x = 0; x < map.w; x++) {
        map.set(x, lowestRock + 2, ROCK);
    }
    let count = 0;
    while (simulateSand(map, 500, 0, lowestRock + 2)) {
        count++;
        if (map.get(500, 0) === SAND) { break; }
    }
    return count;
}

function simulateSand(map, x, y, maxY) {
    while(y <= maxY) {
        if (map.get(x, y + 1) === AIR) {
            // down
            y++;
        } else {
            if (map.get(x - 1, y + 1) === AIR) {
                // down left
                x--;
                y++;
            } else if (map.get(x + 1, y + 1) === AIR) {
                // down right
                x++;
                y++;
            } else {
                // settle down
                map.set(x, y, SAND);
                return {x, y};
            }
        }
    }
    // falling into endless void
    return null;
}

const data = prepareData(data1);
console.log("Part 1: ", part1(data.clone()));
console.log("Part 2: ", part2(data));