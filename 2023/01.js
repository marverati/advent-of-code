require('./_helpers.js');
const { data1 } = require('./01data.js');

const data0 = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const data0b = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return lines;
}

function part1(data) {
    const values = data.map(line => {
        const nums = line.split('').filter(c => c == +c).map(s => +s);
        return 10 * nums.first + nums.last;
    });
    return values.sum();
}

const numWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function part2(data) {
    const values = data.map(line => {
        // Turn each word into a digit, but surround with word itself to allow it to still be used for other numWords
        // e.g. 'xtwone3four' -> 'xtwone1one3four' -> 'xtwo2twone1one3four' -> 'xtwo2twone1one3four4four'
        // afterwards, solution from part 1 can be applied
        numWords.forEach((w, i) => { line = line.replaceAll(w, w + i + w); })
        const nums = line.split('').filter(c => c == +c).map(s => +s);
        return 10 * nums.first + nums.last;
    });
    return values.sum();
}

const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));