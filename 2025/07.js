require('./_helpers.js');
const { data0: data0a, data1 } = require('./07-data.js');
const { logTime, assertEqualSoft } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0b = `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

function part1(data) {
    let result = 0;
    let cols = [ data[0].indexOf('S') ];
    let y = 0;
    while (data[++y]) {
        // Check for splitting
        for (let i = cols.length - 1; i >= 0; i--) {
            const x = cols[i];
            if (data[y][x] === '^') {
                result++;
                // Remove old trail
                cols.splice(i, 1);
                // Push up to two new ones while avoiding duplicates
                if (data[y][x-1] === '.' && !cols.includes(x-1)) {
                    cols.push(x-1);
                }
                if (data[y][x+1] === '.' && !cols.includes(x+1)) {
                    cols.push(x+1);
                }
            }
        }
    }
    return result;
}

function part2(data) {
    // Store trail columns together with how many timelines they represent
    let cols = [ { x: data[0].indexOf('S'), count: 1} ];
    let y = 0;
    while (data[++y]) {
        // Check for splitting
        for (let i = cols.length - 1; i >= 0; i--) {
            const {x, count} = cols[i];
            if (data[y][x] === '^') {
                // Remove old trail
                cols.splice(i, 1);
                // Add up to two new ones, either creating new trails or just adding timeline count on top
                if (data[y][x-1] === '.') {
                    cols[findOrCreateTrail(x - 1)].count += count;
                }
                if (data[y][x+1] === '.') {
                    cols[findOrCreateTrail(x + 1)].count += count;
                }
            }
        }
    }
    return cols.map(v => v.count).sum();

    function findOrCreateTrail(x) {
        let i = cols.findIndex(v => v.x === x);
        if (i < 0) {
            i = cols.length;
            cols.push({x, count: 0});
        }
        return i;
    }
}

// Prepare data getters
const sampleData = () => prepareData(data0a || data0b);
const userData = () => prepareData(data1);

// Part 1
assertEqualSoft("Part 1 works with example", part1(sampleData()), 21); // <- adjust
logTime("Part 1: ", () => part1(userData()));

// Part 2
assertEqualSoft("Part 2 works with example", part2(sampleData()), 40); // <- adjust
logTime("Part 2: ", () => part2(userData()));