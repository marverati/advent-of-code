require('./_helpers.js');
const { data0: data0a, data1 } = require('./00-data.js');
const { logTime, logProgress } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0b = ``

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return lines;
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

function part1(data) {

    return
}

function part2(data) {
    
    return
}


const data0 = data0a || data0b;
const data = prepareData(data0);
(data.length < 50 || data instanceof Object && !(data instanceof Array)) && console.log(data);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));