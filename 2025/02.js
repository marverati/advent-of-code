require('./_helpers.js');
const { data0: data0a, data1 } = require('./02-data.js');
const { assertEqual, logTime, logProgress, assert } = require('./_util.js');

const data0b = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`

function prepareData(data) {
    const lines = data
        .split(",") // turn into array of lines
        .map(line => line.trim().split('-')) // trim white space
    return lines;
}

function part1(data) {
    let sum = 0;
    for (const line of data) {
        const invSum = getInvalidIds(line);
        sum += invSum;
    }
    return sum;
}

function getInvalidIds(line) {
    let [min, max] = line;
    if (max.length !== min.length) {
        if (min.length % 2 === 1) {
            min = "0" + min;
        } else {
            max = "9".repeat(min.length);
        }
    } else {
        if (min.length % 2 === 1) {
            return 0;
        }
    }
    assertEqual("Lengths", min.length, max.length);
    assertEqual("Even", min.length % 2, 0);
    const length = min.length;
    const hl = length / 2;
    const vmin = +min, vmax = +max;
    const smin = min.substr(0, hl);
    const smax = max.substr(0, hl);
    let sum = 0;
    for (let s = smin; s <= smax; s++) {
        const num = +('' + s + s);
        if (num >= vmin && num <= vmax) {
            sum += num;
        }
    }

    return sum;
}

function part2(data) {
    let sum = 0;
    for (const line of data) {
        const invSum = getInvalidIds2(line);
        sum += invSum;
    }
    return sum;
}

function getInvalidIds2(line) {
    const [min, max] = line;
    if (min.length !== max.length) {
        assert("Diff no larger than 1", max.length - min.length === 1);
        const cut1 = '9'.repeat(min.length);
        const cut2 = '1' + '0'.repeat(min.length);
        return getInvalidIds2SameLength([min, cut1]) + getInvalidIds2SameLength([cut2, max]);
    }
    return getInvalidIds2SameLength(line);
}

function getInvalidIds2SameLength(line) {
    let [min, max] = line;
    assert("Same length", min.length === max.length);
    const maxL = min.length / 2;
    const vmin = +min, vmax = +max;
    let sum = 0;
    const added = new Set();
    for (let partL = 1; partL <= maxL; partL++) {
        if (min.length % partL > 0) { // length does not match
            continue;
        }
        const repetitions = min.length / partL;
        const smin = +min.substr(0, partL);
        const smax = +max.substr(0, partL);
        for (let s = smin; s <= smax; s++) {
            const num = +('' + s).repeat(repetitions);
            if (!added.has(num)) {
                if (num >= vmin && num <= vmax) {
                    sum += num;
                    added.add(num);
                }
            }
        }
    }

    return sum;
}


const sampleData = () => prepareData(data0a || data0b);
assertEqual("Part 1 works with example", part1(sampleData()), 1227775554);
assertEqual("Part 2 works with example", part2(sampleData()), 4174379265);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));