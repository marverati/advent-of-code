require('./_helpers.js');
const { data0: data0a, data1 } = require('./00-data.js');
const { assertEqual, logTime, logProgress } = require('./_util.js');
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


const sampleData = prepareData(data0a || data0b);
console.log(sampleData);
assertEqual("Part 1 works with example", part1(sampleData), undefined);
assertEqual("Part 2 works with example", part2(sampleData), undefined);

const userData = prepareData(data1);
// (userData.length < 50 || userData instanceof Object && !(userData instanceof Array)) && console.log(userData);
logTime("Part 1: ", () => part1(userData));
logTime("Part 2: ", () => part2(userData));