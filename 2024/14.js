require('./_helpers.js');
const { data0, data1 } = require('./14-data.js');
const { assertEqual, logTime, logProgress, absMod, deepCopy, logDelayed } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => parseRobot(line));
    return lines;

    function parseRobot(line) {
        const parts = line.split(' ');
        const p = parts[0].slice(2).split(',').map(v => +v);
        const v = parts[1].slice(2).split(',').map(v => +v);
        return {p: {x: p[0], y: p[1]}, v: {x: v[0], y: v[1]}};
    }
}

function part1(data, w, h) {
    for (let i = 0; i < 100; i++) {
        simulateStep(data, w, h);
    }
    // Count
    const quads = [0,0,0,0];
    const mx = (w - 1) / 2;
    const my = (h - 1) / 2;
    for (const robot of data) {
        if (robot.p.x === mx || robot.p.y === my) {
            continue;
        }
        const qx = robot.p.x < mx ? 0 : 1;
        const qy = robot.p.y < my ? 0 : 1;
        const index = qx + 2 * qy;
        quads[index]++;
    }
    return quads.product();
}

function simulateStep(robots, w, h) {
    for (const r of robots) {
        r.p.x = absMod(r.p.x + r.v.x, w);
        r.p.y = absMod(r.p.y + r.v.y, h);
    }
}

function part2(robots, w, h) {
    const maxSteps = w * h; // afterwards, things necessarily repeat
    let foundIndices = [];
    for (let i = 0; i < maxSteps; i++) {
        simulateStep(robots, w, h);
        if (couldBeTree(robots, w, h)) {
            foundIndices.push(i);
            console.log('Map after step ' + i + ':');
            console.log(robotsToMap(robots, w, h));
            console.log(`End of step ${i}`)
            console.log('----------------');
        }
    }
    if (foundIndices.length === 1) {
        return foundIndices[0]; // Single solution found \o/
    }
    if (foundIndices.length > 1) {
        logDelayed('Multiple candidates found, please check console outputs above');
        return foundIndices; // Multiple solutions found :/ User should check log for details
    }
    logDelayed('No Christmas tree found');
    return -1;
}

function robotsToMap(data, w, h) {
    const map = new Array2D(w, h, ' ');
    data.forEach(r => map[r.p.y][r.p.x] = 'X');
    return map.toString(c => c, '', '\n');
}

function couldBeTree(data, w, h) {
    return robotsToMap(data, w, h).includes('XXXXXXXXXXX'); // <- just a heuristic, when robots are neatly ordered we expect to see something like this, which is otherwise unlikely
}


const sampleData = () => prepareData(data0);
assertEqual("Part 1 works with example", part1(sampleData(), 11, 7), 12);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData(), 101, 103));
logTime("Part 2: ", () => part2(userData(), 101, 103));