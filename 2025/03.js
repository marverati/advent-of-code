require('./_helpers.js');
const { data0: data0a, data1 } = require('./03-data.js');
const { assertEqual, logTime } = require('./_util.js');

const data0b = `
987654321111111
811111111111119
234234234234278
818181911112111
`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return lines;
}

const part1 = (data) => sumLargestNumbers(data, 2);
const part2 = (data) => sumLargestNumbers(data, 12);

function sumLargestNumbers(data, digitsPerNumber) {
    let sum = 0;
    for (const line of data) {
        sum += getMaxNum(line, digitsPerNumber);
    }
    return sum;
}

function getMaxNum(line, nums) {
    if (nums < 1) { return 0; }
    // At least (nums-1) digits need to remain on the right side, find maximum outside of those
    // (We can prioritize current number greedily, because it is left-most in number, so has highest importance for the absolute)
    const leftString = line.substr(0, line.length - (nums - 1));
    // Inside of this string, we look for the left-most maximum digit
    const maxNum = leftString.split('').map(c => +c).max();
    const pos = leftString.indexOf(maxNum);
    const rest = getMaxNum(line.substr(pos + 1), nums - 1);
    return (+maxNum) * 10 ** (nums - 1) + rest;
}

// Data getters
const sampleData = () => prepareData(data0a || data0b);
const userData = () => prepareData(data1);

// Part 1
assertEqual("Part 1 works with example", part1(sampleData()), 357);
logTime("Part 1: ", () => part1(userData()));

// Part 2
assertEqual("Part 2 works with example", part2(sampleData()), 3121910778619);
logTime("Part 2: ", () => part2(userData()));