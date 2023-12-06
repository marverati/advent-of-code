require('./_helpers.js');
const { data0, data1 } = require('./07data.js');
const { logTime, logProgress } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');


function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return lines;
}

function part1(data) {

    return
}

function part2(data) {
    
    return
}


const data = prepareData(data0);
(data.length < 50) && console.log(data);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));