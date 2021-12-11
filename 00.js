
const data0 = ``;

const { data1 } = require('./00data');

function prepareData(data) {
  return data.split("\n").map(line => line.trim()).filter(line => line !== "");
}

function part1(data) {

}

function part2(data) {

}


const data = prepareData(data0);
console.log(part1(data));
console.log(part2(data));