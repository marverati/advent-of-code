require('./_helpers.js');
const { data0, data1 } = require('./09-data.js');
const { assertEqual, logTime } = require('./_util.js');

function prepareData(data) {
    let id = -1;
    const nums = [];
    const gaps = [];
    const files = [];
    let isFile = false;
    for (let i = 0; i < data.length; i++) {
        isFile = !isFile;
        const length = +data[i];
        if (isFile) {
            id++;
            files.push({i: nums.length, length});
            for (let j = 0; j < length; j++) {
                nums.push(id);
            }
        } else {
            length > 0 && gaps.push({i: nums.length, length});
            for (let j = 0; j < length; j++) {
                nums.push('.');
            }
        }
    }
    return { nums, gaps, files };
}

function part1({nums}) {
    // Defragmentation
    let i = nums.length;
    let j = 0;
    while (true) {
        while(nums[--i] === '.') {}
        if (i < 0) {
            break;
        }
        while (nums[++j] !== '.') {}
        if (j > i) { break; }
        // Switch
        nums[j] = nums[i];
        nums[i] = '.';
    }
    // Result
    return nums.map((v, i) => v === '.' ? 0 : v * i).sum();
}

function part2({ nums, files, gaps }) {
    // Defragmentation
    for (let f = files.length - 1; f >= 0; f--) {
        if (files[f].length === 0) {
            continue;
        }
        // Find gap for file
        const g = gaps.findIndex(gap => gap.length >= files[f].length && gap.i < files[f].i);
        if (g >= 0) {
            // Move it
            for (let j = 0; j < files[f].length; j++) {
                nums[gaps[g].i + j] = nums[files[f].i + j];
                nums[files[f].i + j] = '.';
            }
            // Adjust filled gap
            if (files[f].length === gaps[g].length) {
                gaps.splice(g, 1);
            } else {
                gaps[g].i += files[f].length;
                gaps[g].length -= files[f].length;
            }
            // Find gap(s) next to former file pos and expand it/them
            const g2 = gaps.findIndex(gap => gap.i > files[f].i);
            if (g2 >= 0 && g2.i === files[f].i + files[f].length) {
                const gap2 = gaps[g2];
                gap2.i -= files[f].length;
                gap2.length += files[f].length;
                const gap1 = gaps[g2 - 1];
                if (gap1 && gap1.i + gap1.length === gap2.i) {
                    gap1.length += gap2.length;
                    gaps.splice(g2);
                }
            } else {
                const g1 = gaps.last;
                if (g1.i === files[f].i + files[f].length) {
                    g1.length += files[f].length;
                }
            }
        }
    }
    // Result
    return nums.map((v, i) => v === '.' ? 0 : v * i).sum();
}


const sampleData = () => prepareData(data0);
assertEqual("Part 1 works with example", part1(sampleData()), 1928);
assertEqual("Part 2 works with example", part2(sampleData()), 2858);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));