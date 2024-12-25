require('./_helpers.js');
const { sample1, data1 } = require('./25-data.js');
const { assertEqual, logTime, range } = require('./_util.js');

function prepareData(data) {
    const blocks = data.trim().split('\n\n');
    const keys = [], locks = [];
    let maxHeight = 0;
    for (const block of blocks) {
        const lines = block.trim().split('\n').map(l => l.trim());
        maxHeight = lines.length;
        const isLock = lines[0][0] === '#';
        const h0 = isLock ? 0 : lines.length - 1;
        const hd = isLock ? 1 : -1;
        const heights = range(lines[0].length).map(x => {
            let h = 0;
            while (lines[h0 + h * hd][x] === '#') { h++; }
            return h;
        });
        if (isLock) {
            locks.push(heights);
        } else {
            keys.push(heights);
        }
    }
    return { locks, keys, maxHeight };
}

function part1({locks, keys, maxHeight}) {
    let fit = 0;
    for (const k of keys) {
        for (const l of locks) {
            if (range(k.length).every(x => k[x] + l[x] <= maxHeight)) {
                fit++;
            }
        }
    }
    return fit;
}


const sampleData = () => prepareData(sample1);
assertEqual("Part 1 works with example", part1(sampleData()), 3);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));