require('./_helpers.js');
const { data0, data1 } = require('./07-data.js');
const { assertEqual, logTime } = require('./_util.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split(' ').map(v => parseInt(v)))
    return lines;
}

function solve(data, part) {
    const operators = [
        (total, first) => total + first,
        (total, first) => total * first,
        (total, first) => parseInt(`${total}${first}`),
    ];
    if (part < 2) { operators.splice(2); }

    return data
        .filter(line => countOperators(line.slice(2), line[0], line[1]))
        .map(line => line[0])
        .sum();

    function countOperators(values, result, total = 0) {
        if (values.length === 0) { return result === total; }
        if (total > result) { return false; } // values can never shrink
        return operators.some(operate => countOperators(values.slice(1), result, operate(total, values[0])));
    }
}

const sampleData = prepareData(data0);
assertEqual("Part 1 works with example", solve(sampleData, 1), 3749);
assertEqual("Part 2 works with example", solve(sampleData, 2), 11387);

const userData = prepareData(data1);
logTime("Part 1: ", () => solve(userData, 1));
logTime("Part 2: ", () => solve(userData, 2));