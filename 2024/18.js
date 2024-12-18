require('./_helpers.js');
const { sample1, data1 } = require('./18-data.js');
const { assertEqual, logTime, bfs } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');


function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(l => l.split(',').map(v => +v));
    return lines;
}

function part1(data, size, bytes) {
    // Fill map with bytes
    const map = new Array2D(size, size, () => '.');
    for (let i = 0; i < bytes; i++) {
        map.set(data[i][0], data[i][1], '#');
    }
    // Search for path from top left to bottom right
    const path = bfs(
        [0, 0], // start at top left
        p => { // compute available neighbors for each position
            const nbs = [[0, -1], [1, 0], [0, 1], [-1, 0]].map(off => [p[0] + off[0], p[1] + off[1]]);
            return nbs.filter(n => map.isInside(n[0], n[1]) && map.get(n[0], n[1]) === '.');
        },
        p => p[0] === size - 1 && p[1] === p[0], // end at bottom right
        e => {}, // no need to process tiles any further
        p => p.join(',') // make tile positions detectable to let each tile be visited only once
    )
    return path ? path.length : false;
}

function part2(data, size, bytes) {
    // Perform binary search to find first number of bytes where no path exists
    let min = bytes, max = data.length;
    while (max > min + 1) {
        const mid = Math.round((min + max) / 2);
        if (part1(data, size, mid + 1)) {
            min = mid;
        } else {
            max = mid;
        }
    }
    // Now min should be the highest to find a path, and max the lowest to not find a path
    return data[max].join(',');
}


const sampleData = () => prepareData(sample1);
assertEqual("Part 1 works with example", part1(sampleData(), 7, 12), 22);
assertEqual("Part 2 works with example", part2(sampleData(), 7, 12), '6,1');

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData(), 71, 1024));
logTime("Part 2: ", () => part2(userData(), 71, 1024));