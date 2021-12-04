
const list0 = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`

const { list1 } = require('./03data')


function getGammaDelta(list) {
    const lines = list.split("\n");
    const sum = [];
    const chars = lines[0].length;
    for (const line of lines) {
        for (let i = 0; i < chars; i++) {
            sum[i] = (sum[i] ?? 0) + (+line[i]);
        }
    }
    let gamma = 0, delta = 0;
    for (let i = 0; i < chars; i++) {
        const cGamma = sum[i] > (lines.length - sum[i]) ? 1 : 0;
        const cDelta = 1 - cGamma;
        const fac = 2 ** (chars - i - 1);
        gamma += fac * cGamma;
        delta += fac * cDelta;
    }
    const result = gamma * delta;
    return result;
}

function getOxigenOrCo2(list, invert = false) {
    // find most common at each index and filter down
    let lines = list.split("\n");
    const sum = [];
    const chars = lines[0].length;
    for (let i = 0; i < chars; i++) {
        let common = getCommon(lines, i, 1);
        if (invert) { common = 1 - common; }
        lines = lines.filter(line => line[i] == common);
        if (lines.length === 1) { break; }
    }
    return parseInt(lines[0], 2);

    function getCommon(lines, index) {
        let c0 = 0, c1 = 0;
        for (const line of lines) {
            if (line[index] == "1") {
                c1++;
            } else {
                c0++;
            }
        }
        return c1 >= c0 ? 1 : 0;
    }
}

const ox = getOxigenOrCo2(list1, false);
const co2 = getOxigenOrCo2(list1, true);

console.log("Result1: ", getGammaDelta(list1));
console.log("Result2: ", ox * co2);