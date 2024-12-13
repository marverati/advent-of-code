require('./_helpers.js');
const { data0, data1 } = require('./13-data.js');
const { assertEqual, logTime } = require('./_util.js');

function prepareData(data) {
    const result = data
        .split("\n\n") // turn into array of lines
        .map(block => {
            const lines = block.split('\n').filter(l => l != '');
            return {
                a: parseXY(lines[0]),
                b: parseXY(lines[1]),
                prize: parseXY(lines[2]),
            }
        });
    return result;
    
    function parseXY(line) {
        const right = line.split(': ')[1];
        const parts = right.split(', ');
        const x = +parts[0].slice(2);
        const y = +parts[1].slice(2);
        return {x,y};
    }
}

function part1(data) {
    let result = 0;
    for (const block of data) {
        const tokens = calcSteps(block);
        if (isFinite(tokens)) {
            result += tokens;
        }
    }
    return result;
}

function calcSteps(block) {
    const calcMap = new Map();
    const prize = block.prize;
    // Block: a, b, prize
    return calc(0, 0);

    function calc(sa, sb) {
        const h = hash(sa, sb);
        if (calcMap.has(h)) {
            return calcMap.get(h);
        }
        if (sa > 100 || sb > 100) { calcMap.set(h, Infinity); return Infinity; }
        const x = block.a.x * sa + block.b.x * sb;
        const y = block.a.y * sa + block.b.y * sb;
        if (x === prize.x && y === prize.y) {
            const result = 3 * sa  + 1 * sb;
            calcMap.set(h, result);
            return result; // token prizes
        }
        // Recurse
        const result = Math.min(
            calc(sa + 1, sb),
            calc(sa, sb + 1),
        );
        calcMap.set(h, result);
        return result;
    }

    function hash(x, y) {
        return `${x},${y}`;
    }
}

function part2(data) {
    for (const block of data) {
        block.prize.x += 10000000000000;
        block.prize.y += 10000000000000;
    }
    return part2b(data);
}


function part2b(data) {
    let result = 0;
    for (const block of data) {
        const tokens = calcSteps2(block);
        if (isFinite(tokens)) {
            result += tokens;
        }
    }
    return result;
}

function calcSteps2(block) {
    const ax = block.a.x, ay = block.a.y, bx = block.b.x, by = block.b.y;
    const px = block.prize.x, py = block.prize.y;
    // I use ALGEBRA to compute the STEPS
    const stepsB = Math.round((ax * py / ay - px) / (ax * by / ay - bx));
    const stepsA = Math.round((px - stepsB * bx) / ax);
    // Check if steps actually end up on result; otherwise there's no solution
    const rx = stepsA * ax + stepsB * bx;
    const ry = stepsA * ay + stepsB * by;
    if (rx === px && ry === py) {
        return 3 * stepsA + stepsB; // great success
    }
    return Infinity; // oh no
}


const sampleData = () => prepareData(data0);
assertEqual("Part 1 works with example", part1(sampleData()), 480);
assertEqual("Part 2 works with example", part2(sampleData()), 875318608908);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));