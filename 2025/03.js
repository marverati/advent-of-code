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

function part1(data) {
    let sum = 0;
    for (const line of data) {
        let max = 0;
        for (let i = 0; i < line.length - 1; i++) {
            for (let j = i + 1; j < line.length; j++) {
                const num = 10 * (+line[i]) + (+line[j]);
                if (num > max) { max = num; }
            }
        }
        sum += max;
    }
    return sum;
}

function part2(data) {
    let sum = 0;
    for (const line of data) {
        const values = getMaxNum(line);
        let v = 0;
        while (values.length) {
            v = 10 * v + values.shift();
        }
        console.log(values, v);
        sum += v;
    }
    return sum;
}

function getMaxNum(line, nums = 12) {
    if (nums < 1) { return []; }
    // Find maximum when nums-1 are left on right
    const leftString = line.substr(0, line.length - (nums - 1));
    // Pick left-most max number
    const maxNum = leftString.split('').map(c => +c).max();
    const pos = leftString.indexOf(maxNum);
    const rest = getMaxNum(line.substr(pos + 1), nums - 1);
    rest.unshift(maxNum);
    return rest;
}


const sampleData = () => prepareData(data0a || data0b);
assertEqual("Part 1 works with example", part1(sampleData()), 357);
assertEqual("Part 2 works with example", part2(sampleData()), 3121910778619);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));