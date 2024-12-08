require('./_helpers.js');
const { data0, data1 } = require('./08-data.js');
const { assertEqual, logTime } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

function part1(data) {
    return getAntinodes(data, () => [1]);
}

function part2(data) {
    return getAntinodes(data, infiniteCounter);
}

function* infiniteCounter() {
    let i = 0;
    while (true) {
        yield i++;
    }
}

function getAntinodes(data, distanceFactorIterator) {
    const valueToPositions = {};
    data.forEachCell((v, x, y) => {
        if (v === '.') { return; }
        if (!valueToPositions[v]) { valueToPositions[v] = []; }
        valueToPositions[v].push({x,y});
    });
    const antinodes = new Set();
    const values = Object.keys(valueToPositions);
    for (const v of values) {
        const positions = valueToPositions[v];
        for (let i = 1; i < positions.length; i++) {
            const p1 = positions[i];
            for (let j = 0; j < i; j++) {
                const p2 = positions[j];
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const steps = distanceFactorIterator();
                for (let f of steps) {
                    const added1 = addAntinode(p1.x - f * dx, p1.y - f * dy);
                    const added2 = addAntinode(p2.x + f * dx, p2.y + f * dy);
                    if (!added1 && !added2) { break; }
                }
            }
        }
    }
    return antinodes.size;

    function addAntinode(x,y) {
        if (!data.isInside(x, y)) { return false; }
        const hash = `${x},${y}`;
        antinodes.add(hash);
        return true;
    }
}

const sampleData = prepareData(data0);
assertEqual("Part 1 works with example", part1(sampleData), 14);
assertEqual("Part 2 works with example", part2(sampleData), 34);

const userData = prepareData(data1);
logTime("Part 1: ", () => part1(userData));
logTime("Part 2: ", () => part2(userData));