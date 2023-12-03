require('./_helpers.js');
const { data0, data1 } = require('./03data.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return lines;
}

function linesToNums(input) {
    const lines = input.map(line => line + ".");
    lines.unshift(input[0].map(c => '.'));
    lines.push(lines[0]);
    const nums = [];
    for (let l = 1; l < lines.length - 1; l++) {
        const line = lines[l];
        const numbers = line.match(/\d+/g) || [];
        let x1 = -1;
        for (const num of numbers) {
            x1 = line.indexOf(num, x1);
            const x2 = x1 + num.length - 1;
            nums.push({
                num: +num,
                x1,
                x2,
                y: l - 1,
            });
            x1 += num.length;
        }
    }
    return nums;
}

function isSymbol(char) {
    return char && char != '.' && char != +char;
}

function part1(lines) {
    const nums = linesToNums(lines);
    const symbolNums = nums.filter(numHasSymbol);
    return symbolNums.map(n => n.num).sum();

    function numHasSymbol(num) {
        for (let l = num.y - 1; l <= num.y + 1; l++) {
            for (let x = num.x1 - 1; x <= num.x2 + 1; x++) {
                if (lines[l] && isSymbol(lines[l][x])) {
                    return true;
                }
            }
        }
        return false;
    }
}

function part2(data) {
    const nums = linesToNums(data);
    let result = 0;
    for (let l = 0; l < data.length; l++) {
        const line = data[l];
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '*') {
                const gearNums = nums.filter(n => Math.abs(n.y - l) <= 1 && n.x1 <= i + 1 && n.x2 >= i - 1);
                if (gearNums.length === 2) {
                    const gearRatio = gearNums[0].num * gearNums[1].num;
                    result += gearRatio;
                }
            }
        }
    }
    return result;
}

const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));