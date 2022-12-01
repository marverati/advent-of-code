require('./_helpers.js');
const { data1 } = require('./01data');

const data0 = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;


function prepareData(data) {
    const elves = [0];
    const lines = data.split("\n").map(line => line.trim());
    for (const line of lines) {
        if (line === "") {
            // New elve
            elves.push(0);
        } else {
            // Add calories to previous one
            const cal = +line;
            elves.last += cal;
        }
    }
    return elves.sort((a, b) => b - a);
}

function part1(elves) {
    return elves[0];
}

function part2(elves) {
    return elves[0] + elves[1] + elves[2];
}

const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));