
const data0 = ``;

const { data1 } = require('./11data');
const { getMin, getMax } = require('./_util');

function prepareData(data) {
  return data.split("\n");
}

function part1(data) {

}

function part2(data) {

}


const data = prepareData(data0);
console.log(part1(data));
console.log(part2(data));

const numbers = [7, 9, 5, 2, 2, 2];
console.log(getMin(numbers));
console.log(getMax(numbers));