require('./_helpers.js');
const { data0, data1, data2 } = require('./09data');
const Array2D = require('./dataStructures/Array2D.js');
const { deepCopy } = require('./_util.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split(' '))
        .map(values => [values[0], +values[1]])
    return lines;
}

function simulate(data, knotCount = 2) {
    const visited = new Set();
    const knots = Array.create(knotCount).map(v => ({x: 0, y: 0}));
    for (const move of data) {
        const dir = "URDL".indexOf(move[0]);
        const diff = [[0,1],[1,0],[0,-1],[-1,0]][dir];
        // Step in that direction n times
        for (let i = 0; i < move[1]; i++) {
            // Update head
            knots[0].x += diff[0];
            knots[0].y += diff[1];
            // Update tail
            for (let i = 1; i < knots.length; i++) {
                updateKnot(knots[i], knots[i - 1]);
            }
            // Track position of last tail knot
            const key = knots.last.x + "," + knots.last.y;
            if (!visited.has(key)) {
                visited.add(key);
            }
        }
    }
    return visited.size;
}

function updateKnot(pos, refPos) {
    const dx = refPos.x - pos.x, dy = refPos.y - pos.y;
    // Touching already -> no move needed
    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
        return;
    }
    // Not touching -> move by 1 in x & y, unless distance in direction is 0
    if (dx !== 0) {
        pos.x += (dx > 0) ? 1 : -1;
    }
    if (dy !== 0) {
        pos.y += (dy > 0) ? 1 : -1;
    }
}

const data = prepareData(data1);
(data.length < 50) && console.log(data);
console.log("Part 1: ", simulate(deepCopy(data), 2));
console.log("Part 2: ", simulate(data, 10));