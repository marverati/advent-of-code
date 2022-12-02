require('./_helpers.js');
const { data1 } = require('./00data');

const data0 = ``;

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
console.log(data);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));