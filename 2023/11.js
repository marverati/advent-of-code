require('./_helpers.js');
const { data0, data1 } = require('./11-data.js');
const { logTime, logProgress, range } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

function sumDistances(data, spaceGrowthFactor) {
    const xs = range(0, data.w);
    const ys = range(0, data.h);

    // Find empty rows and columns to grow them
    const emptyXs = xs.filter(x => ys.every(y => data[y][x] === '.'));
    const emptyYs = ys.filter(y => xs.every(x => data[y][x] === '.'));
    // Create a mapping from measured coordinates to real coordinates
    const realXs = [0], realYs = [0];
    const spaceAddition = spaceGrowthFactor - 1;
    for (const x of xs.slice(1)) {
        realXs[x] = (realXs[x - 1]) + 1 + (emptyXs.includes(x) ? spaceAddition : 0);
    }
    for (const y of ys.slice(1)) {
        realYs[y] = (realYs[y - 1]) + 1 + (emptyYs.includes(y) ? spaceAddition : 0);
    }

    // Identify galaxies
    let id = 1;
    const galaxies = [];
    data.forEachCell((v, x, y) => {
        if (data[y][x] === '#') {
            galaxies.push({id, x, y});
            id++;
        }
    });

    // Find pairwise shortest distance between galaxies
    let sum = 0;
    for (const g of galaxies) {
        for (const h of galaxies) {
            if (g.id < h.id) {
                sum += getGalaxyDistance(g, h);
            }
        }
    }
    return sum;

    function getGalaxyDistance(g, h) {
        // Transform measured galaxy distance to actual galaxy distance
        const gx = realXs[g.x], gy = realYs[g.y];
        const hx = realXs[h.x], hy = realYs[h.y];
        // Count number of steps
        const dx = hx - gx, dy = hy - gy;
        return Math.abs(dx) + Math.abs(dy);
    }
}

function part1(data) {
    return sumDistances(data, 2);
}

function part2(data) {
    return sumDistances(data, 1000000);
}


const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));