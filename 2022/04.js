require('./_helpers.js');
const { data1 } = require('./04data');
const { fullyContains, overlaps } = require('./_util.js');

const data0 = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split(',').map(part => part.split('-').map(num => +num))) // '2-6,4-8' -> [[2,6],[4,8]]
    return lines;
}

function part1(data) {
    return data.count(line => fullyContains(line[0][0], line[0][1], line[1][0], line[1][1], true))
}

function part2(data) {
    return data.count(line => overlaps(line[0][0], line[0][1], line[1][0], line[1][1]))
}


const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));