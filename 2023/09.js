require('./_helpers.js');
const { data0, data1 } = require('./09-data.js');
const { logTime, logProgress } = require('./_util.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split(' ').map(v => +v)); // turn lines into lists of numbers
    return lines;
}

function getExtrapolated(line) {
    return line.last + getExtrapolatedDerivate(line).last;

    function getExtrapolatedDerivate(line) {
        if (line.every(v => v === 0)) {
            // End condition: only 0s
            const other = line.slice();
            other.push(0); // extrapolation
            return other;
        } else {
            // Intermediate step: derive line and extrapolate recursively
            const d = line.map((v, i) => line[i + 1] - v);
            d.pop();
            d.push( d.last + getExtrapolatedDerivate(d).last ); // extrapolation
            return d;
        }
    }
}

function part1(data) {
    const values = data.map(line => getExtrapolated(line));
    return values.sum();
}

function part2(data) {
    const values = data.map(line => getExtrapolated(line.reverse()));
    return values.sum();
}

const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));