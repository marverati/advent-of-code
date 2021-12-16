
const data0 = ``;

const { data1 } = require('./17data');

function prepareData(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line !== "");
    return lines;
}

function part1(data) {

}

function part2(data) {

}


const data = prepareData(data0);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));