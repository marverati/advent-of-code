require('./_helpers.js');
const { data0, data1 } = require('./02-data.js');
const { logTime, between, getPairs } = require('./_util.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split(' ').map(s => +s))
    return lines;
}

function part1(data) {
    const safe = data.filter(isSafe);
    return safe.length;
}

function part2(data) {
    const safe = data.filter(line => {
        return isSafe(line) || line.some((v, i) =>
            isSafe(line.drop(i, 1)));
    })
    return safe.length;
}

function isSafe(report) {
    const increasing = report[1] > report[0];
    const minDiff = increasing ? 1 : -3;
    const maxDiff = increasing ? 3 : -1;
    return getPairs(report).every(pair =>
        between(pair[1] - pair[0], minDiff, maxDiff));
}

const data = prepareData(data1);
(data.length < 50 || data instanceof Object && !(data instanceof Array)) && console.log(data);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));