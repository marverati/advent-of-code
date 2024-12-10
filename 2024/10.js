require('./_helpers.js');
const { data0, data1 } = require('./10-data.js');
const { assertEqual, logTime, logProgress, bfs, dfs } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => +lines[y][x]);
}

function part1(data) {
    return calculateTrailScore(
        data,
        ({x, y}) => `${x},${y}`, // use hash to ensure all paths are distinct
    );
}

function part2(data) {
    let uniqueId = 0;
    return calculateTrailScore(
        data,
        ({x, y}) => uniqueId++, // we don't properly hash cell coordinates, so that they can be visited multiple times
    );
}

function calculateTrailScore(data, hashingFunction) {
    let score = 0;
    data.forEachCell((v, x, y) => {
        if (v === 0) {
            bfs(
                {x, y}, // start from coordinate of current trailhead
                ({x, y}) => data.directNeighborOffsets.map(off => ({x: x + off[0], y: y + off[1]}))
                    .filter(pos => data[pos.y]?.[pos.x] === data[y][x] + 1), // all reachable direct neighbors
                () => false, // never abort the search (happens implicitly when no reachable neighbors exist)
                ({x, y}) => (data[y][x] === 9) && score++, // increase score when we found a path to a peak
                hashingFunction,
            );
        }
    });
    return score
}


const sampleData = () => prepareData(data0);
assertEqual("Part 1 works with example", part1(sampleData()), 36);
assertEqual("Part 2 works with example", part2(sampleData()), 81);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));