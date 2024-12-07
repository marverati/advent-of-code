require('./_helpers.js');
const { data0, data1 } = require('./06-data.js');
const { assertEqual, logTime, logProgress } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

function part1(data) {
    const guard = data.find(v => v === '^');
    const map = data.map(v => v === '^' ? '.' : v);
    return getPathLengths(map, guard, {x: 0, y: - 1});
}

function part2(data) {
    const guard = data.find(v => v === '^');
    const map = data.map(v => v === '^' ? '.' : v);
    const start = {...guard};
    const obstacleSet = new Set();
    getPathLengths(map, guard, {x: 0, y: - 1}, (nx, ny, hash) => {
        if (!obstacleSet.has(hash) && (nx !== start.x || ny !== start.y)) {
            const cloned = map.clone();
            cloned.set(nx, ny, '#');
            const length = getPathLengths(cloned, {...start}, {x: 0, y: -1});
            if (!isFinite(length)) {
                obstacleSet.add(hash);
            }
        }
    });
    return obstacleSet.size;
}

function getPathLengths(data, guard, direction, handleNextStep) {
    const walked = new Set();
    const walkedWithDir = new Set();
    guard.x -= direction.x;
    guard.y -= direction.y;
    while (true) {
        if (handleNextStep) { // <- only log this in "root" call of this function, not recursion
            logProgress("Progress: ", walked.size, 4559);
        }
        const nx = guard.x + direction.x;
        const ny = guard.y + direction.y;
        if (!data.withinBounds(nx, ny)) {
            break;
        }
        if (data.get(nx, ny) === '#') {
            // Turn around
            direction = getNextDir(direction);
        } else {
            const hash = getHash({x: nx, y: ny});
            handleNextStep?.(nx, ny, hash);
            // Move forward
            guard.x = nx;
            guard.y = ny;
            const dirHash = getHash(guard, direction);
            if (walkedWithDir.has(dirHash)) {
                return Infinity; // Cycle detected
            }
            walked.add(hash);
            walkedWithDir.add(dirHash);
        }
    }
    return walked.size;
}

function getHash(pos, dir) {
    if (dir) {
        return `${pos.x},${pos.y}:${dir.x},${dir.y}`;
    }
    return `${pos.x},${pos.y}`;
}

function getNextDir(d) {
    const ndx = -d.y;
    const ndy = d.x;
    return { x: ndx, y: ndy };
}


const sampleData = prepareData(data0);
assertEqual("Part 1 works with example", part1(sampleData), 41);
assertEqual("Part 2 works with example", part2(sampleData), 6);

const userData = prepareData(data1);
logTime("Part 1: ", () => part1(userData));
logTime("Part 2: ", () => part2(userData));