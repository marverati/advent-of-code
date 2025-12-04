require('./_helpers.js');
const { data0: data0a, data1 } = require('./04-data.js');
const { assertEqual, logTime } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0b = `
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    // return lines;
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

function part1(data) {
    return data.countCells((v, x, y) => {
        if (v !== '@') { return 0; }
        return data.get8Neighbors(x, y).count(n => n.v !== '.') <= 3;
    })
}

function part2(data) {
    let result = 0, removed = 0;
    do {
        removed = data.countCells((v, x, y) => {
            if (v !== '@') { return 0; }
            const removable = data.get8Neighbors(x, y).count(n => n.v !== '.') <= 3;
            if (removable) {
                data.set(x, y, '.');
            }
            return +removable;
        });
        result += removed;
    } while(removed > 0);
    return result;
}

// Prepare data getters
const sampleData = () => prepareData(data0a || data0b);
const userData = () => prepareData(data1);

// Part 1
assertEqual("Part 1 works with example", part1(sampleData()), 13);
logTime("Part 1: ", () => part1(userData()));

// Part 2
assertEqual("Part 2 works with example", part2(sampleData()), 43);
logTime("Part 2: ", () => part2(userData()));