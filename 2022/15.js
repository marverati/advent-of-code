require('./_helpers.js');
const { data0, data1 } = require('./15data');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split('=').slice(1).map(seg => parseInt(seg)))
        .map(line => ({
            x: line[0],
            y: line[1],
            bx: line[2],
            by: line[3],
            dis: Math.abs(line[2] - line[0]) + Math.abs(line[3] - line[1]) // Manhattan distance
        }));
    return lines;
}

function part1(sensors, y) {
    // Map all sensor ranges to their concrete range in row y
    const rangesAtY = sensors.map(line => {
        const dy = Math.abs(line.y - y);
        const rangeSize = line.dis - dy;
        if (rangeSize >= 0) {
            return [line.x - rangeSize, line.x + rangeSize];
        } else {
            return null;
        }
    }).filter(line => line != null);
    // Find bounds
    const xmin = rangesAtY.map(r => r[0]).min();
    const xmax = rangesAtY.map(r => r[1]).max();
    // Count points within bounds
    let count = 0;
    for (let x = xmin; x <= xmax; x++) {
        if (sensors.every(r => r.bx !== x || r.by !== y)) { // discount beacons
            if (rangesAtY.some(r => r[0] <= x && r[1] >= x)) { // check overlap with sensor reports
                count++;
            }
        }
    }
    return count;
}

function part2(sensors, bound) {
    const reported = new Set();
    const minx = 0, miny = 0, maxx = bound, maxy = bound
    for (const s of sensors) {
        const dis = Math.abs(s.bx - s.x) + Math.abs(s.by - s.y) + 1;
        // For each sensor, test all points just out of its reach
        for (let x = 0; x <= dis; x++) {
            testPoint(s.x + x, s.y - dis + x);
            testPoint(s.x - x, s.y - dis + x);
            testPoint(s.x + x, s.y + dis - x);
            testPoint(s.x - x, s.y + dis - x);
        }
    }
    
    function testPoint(x, y) {
        if (x < minx || y < miny || x > maxx || y > maxy) {
            return;
        }
        // If this point does not overlap with any sensor's detected area, then it's a candidate
        if (sensors.every(s => Math.abs(x - s.x) + Math.abs(y - s.y) > Math.abs(s.bx - s.x) + Math.abs(s.by - s.y))) {
            const tuningFrequency = y + 4000000 * x;
            if (!reported.has(tuningFrequency)) {
                reported.add(tuningFrequency);
                console.log('Part 2 found: ', { x, y, tuningFrequency });
            }
        }
    }
    
    return Array.from(reported.values())[0];
}

// const data = prepareData(data0), y = 10, bound = 20;
const data = prepareData(data1), y = 2000000, bound = 4000000;
console.log("Part 1: ", part1(data, y));
console.log("Part 2: ", part2(data, bound));