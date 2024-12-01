require('./_helpers.js');
const { data0: data0a, data1 } = require('./01-data.js');
const { logTime, sortNums, zip, zipMap } = require('./_util.js');

const data0b = ``;

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split('   ').map(s => +s)) // split into two numbers
    const left = lines.map(l => l[0]);
    const right = lines.map(l => l[1]);
    return {left, right};
}

function part1(data) {
    const l = data.left.slice();
    const r = data.right.slice();
    sortNums(l);
    sortNums(r);
    return zipMap(l, r, (vl, vr) => Math.abs(vl - vr)).sum();
}

function part2(data) {
    const l = data.left.slice();
    const r = data.right.slice();
    return l.map((vl, i) => vl * r.filter(v => v === vl).length).sum();
}


const data0 = data0a || data0b;
const data = prepareData(data1);
(data.length < 50 || data instanceof Object) && console.log(data);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));