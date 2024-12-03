require('./_helpers.js');
const { data0, data1 } = require('./03-data.js');
const { logTime, cleanIndex, dropFromString } = require('./_util.js');

function part1(data) {
    const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
    let match;
    let product = 0;

    while ((match = regex.exec(data)) !== null) {
        const num1 = parseInt(match[1], 10);
        const num2 = parseInt(match[2], 10);
        product += num1 * num2;
    }

    return product;
}

function part2(data) {
    // Cut out don't()...do() blocks
    let p1 = 0
    while ((p1 = data.indexOf('don\'t()')) >= 0) {
        const p2 = cleanIndex(data.indexOf('do()', p1));
        data = dropFromString(data, p1, p2 + 4 - p1);
    }
    return part1(data);
}


const data = data1;
(data.length < 50 || data instanceof Object && !(data instanceof Array)) && console.log(data);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));