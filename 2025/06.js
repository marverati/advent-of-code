require('./_helpers.js');
const { data0: data0a, data1 } = require('./06-data.js');
const { logTime, assertEqualSoft, range } = require('./_util.js');

const data0b = `
123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
`

function prepareData(input) {
    const lines = input
        .split("\n") // turn into array of lines
        .filter(line => line.trim() !== "") // remove empty lines
    // Find all the columns where all lines have spaces
    const splitPoints = range(0, lines[0].length).filter(offset => lines.every(line => line[offset] === ' '));
    // Ensure to take left-most and right-most numbers into account
    splitPoints.unshift(-1);
    splitPoints.push(lines[0].length + 1);
    // Get all the individual numbers into line-wise arrays
    const data = lines.map(line => []);
    for (let i = 1; i < splitPoints.length; i++) {
        const left = splitPoints[i - 1], right = splitPoints[i];
        for (let d = 0; d < data.length; d++) {
            data[d].push(lines[d].substring(left + 1, right));
        }
    }
    data.last = data.last.map(v => v.trim()); // Operators don't need any whitespace
    return data;
}

function part1(data) {
    let total = 0;
    const columnCount = data[0].length;
    const allNumbers = data.slice(0, data.length - 1).map(line => line.map(v => +v.trim()));
    const operators = data.last;
    for (let column = 0; column < columnCount; column++) {
        const numbers = allNumbers.map(numLine => numLine[column]).filter(v => !isNaN(v)); // filter out invalid numbers (part2 may utilize this)
        switch (operators[column]) {
            case '+':
                total += numbers.sum();
                break;
            case '*':
                total += numbers.product();
                break;
        }
    }
    return total;
}

function part2(data) {
    // Transform numbers to original format, so part1 can be used as a solver
    const originalNumbers = data.slice(0, data.length - 1).map(line => line.slice());
    const columnCount = data[0].length;
    const numLineCount = data.length - 1;
    for (let c = 0; c < columnCount; c++) {
        const oldNums = range(0, numLineCount).map(v => originalNumbers[v][c]);
        const newNumCount = oldNums.map(n => n.trim().length).max();
        // Construct and store the new numbers
        for (let i = 0; i < newNumCount; i++) {
            const digits = oldNums.map(j => j[i]).filter(v => v !== ' ').map(v => +v);
            const newValue = digits.map((d, i) => 10 ** (digits.length - i - 1) * d).sum();
            data[i][c] = `${newValue}`;
        }
        // In case there are more numbers in the original column, mark them as 'to be ignored' for part 1
        for (let i = newNumCount; i < numLineCount; i++) {
            data[i][c] = '👻'; // the internationally accepted symbol for 'not a number'
        }
    }
    // With numbers properly transformed, part1 can do its thing
    return part1(data);
}

// Prepare data getters
const sampleData = () => prepareData(data0a || data0b);
const userData = () => prepareData(data1);

// Part 1
assertEqualSoft("Part 1 works with example", part1(sampleData()), 4277556);
logTime("Part 1: ", () => part1(userData()));

// Part 2
assertEqualSoft("Part 2 works with example", part2(sampleData()), 3263827);
logTime("Part 2: ", () => part2(userData()));