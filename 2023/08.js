require('./_helpers.js');
const { data1 } = require('./08-data.js');
const { logTime, logProgress, getLowestCommonMultiple } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`

const data0b = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    const rules = lines.slice(1).map(lineToRule);
    const rulesObj = {};
    for (const rule of rules) {
        rulesObj[rule.name] = rule;
    }
    return {
        pattern: lines[0],
        rules: rulesObj,
    }
}

function lineToRule(line) {
    const parts = line.split(' = ');
    const name = parts[0];
    const other = parts[1].substring(1, parts[1].length - 1).split(', ');
    return {
        name,
        L: other[0],
        R: other[1],
    };
}

function computeStepCount(data, pos, endCondition) {
    let steps = -1;
    while (!endCondition(pos)) {
        steps++;
        const dir = data.pattern[steps % data.pattern.length];
        pos = data.rules[pos][dir];
    }
    return steps + 1;
}

function part1(data) {
    return computeStepCount(data, 'AAA', s => s === 'ZZZ');
}

function part2(data) {
    const cursors = Object.keys(data.rules).filter(rule => rule.endsWith('A'));
    const steps = cursors.map(cursor => computeStepCount(data, cursor, s => s.endsWith('Z')));
    return getLowestCommonMultiple(steps);
}

const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));