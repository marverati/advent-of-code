require('./_helpers.js');
const { data0, data1 } = require('./13-data.js');
const { assertEqual, logTime } = require('./_util.js');

function prepareData(data) {
    const result = data
        .split("\n\n") // split into blocks
        .map(block => {
            const lines = block.split('\n').filter(l => l != '');
            return {
                a: parseXY(lines[0]),
                b: parseXY(lines[1]),
                prize: parseXY(lines[2]),
            }
        });
    return result;
    
    function parseXY(line) { // e.g. line = "Button B: X+27, Y+71"
        const right = line.split(': ')[1]; // right = "X+27, Y+71"
        const parts = right.split(', '); // pars = ["X+27", "Y+71"]
        const x = +parts[0].slice(2); // 27
        const y = +parts[1].slice(2); // 71
        return {x,y};
    }
}

function part1(data) {
    return data.map(calcSteps).filter(isFinite).sum();
}

function part2(data) {
    for (const block of data) {
        block.prize.x += 10000000000000;
        block.prize.y += 10000000000000;
    }
    return part1(data);
}

function calcSteps(block) {
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
    return Infinity; // impossible
}

const sampleData = () => prepareData(data0);
assertEqual("Part 1 works with example", part1(sampleData()), 480);
assertEqual("Part 2 works with example", part2(sampleData()), 875318608908);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));