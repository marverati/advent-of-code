require('./_helpers.js');
const { sample1, data1 } = require('./19-data.js');
const { assertEqual, logTime } = require('./_util.js');

function prepareData(data) {
    const blocks = data.split('\n\n');
    const available = blocks[0].trim().split(', ');
    const desired = blocks[1].trim().split('\n');
    return { available, desired };
}

function part1(data) {
    return data.desired.map(d => countOptions(d, data.available)).filter(c => c > 0).length;
}

function part2(data) {
    return data.desired.map(d => countOptions(d, data.available)).sum();
}

function countOptions(pattern, available) {
    // e.g. brwrr, [r, wr, b, g, bwu, rb, gb, br]
    const cache = {};
    return _isPossible(pattern);

    function _isPossible(p) {
        if (cache[p]) { return cache[p]; }
        if (p === '') { cache[p] = 1; return 1; }
        const result = available.filter(a => p.startsWith(a))
            .map(m => _isPossible(p.substring(m.length)))
            .sum();
        cache[p] = result;
        return result;
    }
}


const sampleData = () => prepareData(sample1);
assertEqual("Part 1 works with example", part1(sampleData()), 6);
assertEqual("Part 2 works with example", part2(sampleData()), 16);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));