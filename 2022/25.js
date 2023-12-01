require('./_helpers.js');
const { data0, data1 } = require('./25data.js');

const values = {
    '=': -2,
    '-': -1,
    '0': 0,
    '1': 1,
    '2': 2
}

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return lines;
}

function part1(data) {
    let sum = 0
    for (const line of data) {
        const num = getNum(line);
        sum += num;
    }
    const result = invert(sum);
    return {sum, chk: getNum(result), part1: result };
}

function getNum(line) {
    let fac = 1, res = 0;
    for (let i = line.length - 1; i >= 0; i--) {
        res += values[line[i]] * fac;
        fac *= 5;
    }
    return res;
}

function invert(num) {
    const chars = Math.ceil(Math.log(num) / Math.log(5));
    let resultNum = 0, result = '';
    for (let i = 0; i < chars; i++) {
        const fac = 5 ** (chars - i - 1);
        // Find the character in this place that's the closest to the target number
        let bestC = '', bestDis = Infinity;
        for (const c of '012-=') {
            const v = values[c];
            const vres = resultNum + v * fac;
            const vdis = Math.abs(vres - num);
            if (vdis < bestDis) {
                bestDis = vdis;
                bestC = c;
            }
        }
        resultNum += values[bestC] * fac;
        result += bestC;
    }
    return result;
}

const data = prepareData(data1);
console.log(part1(data));