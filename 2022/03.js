require('./_helpers.js');
const { data1 } = require('./03data');
const { cutString } = require('./_util.js');

const data0 = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return lines;
}

function part1(data) {
    let result = 0;
    for (const line of data) {
        const [p1, p2] = cutString(line, line.length / 2);
        // find common letter
        for (const c of p1) {
            if (p2.indexOf(c) >= 0) {
                result += getScore(c);
                break;
            }
        }
    }
    return result;
}

function part2(data) {
    let result = 0;
    for (let g = 0; g < data.length; g += 3) {
        const lines = data.slice(g, g + 3);
        // find common letter
        for (const c of lines[0]) {
            if (lines[1].indexOf(c) >= 0 && lines[2].indexOf(c) >= 0) {
                result += getScore(c);
                break;
            }
        }
    }
    return result
}

function getScore(c) {
    if (c === c.toLowerCase()) {
        return c.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    } else {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
    }
}

const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));