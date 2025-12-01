require('./_helpers.js');
const { data0: data0a, data1 } = require('./01-data.js');
const { assertEqual, logTime, absMod } = require('./_util.js');

let data0b = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line[0] === 'R' ? +line.substr(1) : -+line.substr(1)) // Turn R<v> into v and L<v> into -v
    return lines;
}

function part1(data) {
    let at = 50, count = 0;
    for (const part of data) {
        at = absMod(at + part, 100);
        if (at === 0) {
            count++;
        }
    }
    return count;
}

function part2(data) {
    let at = 50, count = 0;
    for (const part of data) {
        const prev = at;
        at = at + part;
        count += get0Passes(prev, at);
    }
    return count;
}

function get0Passes(prev, current) {
    const start = prev + ((current > prev) ? 1 : -1) / 2;
    const end = current - ((current > prev) ? 1 : -1) / 2;
    const r1 = Math.floor(start / 100);
    const r2 = Math.floor(end / 100);
    const rDiff = Math.abs(r2 - r1);
    const landedOn0 = (absMod(current, 100) === 0) ? 1 : 0;
    return rDiff + landedOn0;
}

// get0Passes unit test
for (const [a, b, result] of [
    [0, 1, 0],
    [-1, 0, 1],
    [0, 2, 0],
    [-2, 0, 1],
    [-2, 1, 1],
    [50, 0, 1],
    [50, 100, 1],
    [0, 99, 0],
    [0, 100, 1],
    [0, 101, 1],
    [-1, 101, 2]
]) {
    assertEqual(`get0Passes(${a},${b}) == ${result}`, get0Passes(a, b), result);
}

const sampleData = () => prepareData(data0a || data0b);
assertEqual("Part 1 works with example", part1(sampleData()), 3);
assertEqual("Part 2 works with example", part2(sampleData()), 6);

const userData = () => prepareData(data1);
assertEqual("Part 1 works with example", part1(userData()), 1076);
assertEqual("Part 2 works with example", part2(userData()), 6379);
logTime("Part 1: ", () => part2(userData()));
logTime("Part 2: ", () => part2(userData()));