require('./_helpers.js');
const { data0: data0a, data1 } = require('./05-data.js');
const { assertEqual, logTime } = require('./_util.js');

const data0b = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`

function prepareData(data) {
    const sections = data.split('\n\n');
    const ranges = sections[0]
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split('-').map(v => +v)); // turn '10-15' into [10,15]
    const items = sections[1]
        .split('\n')
        .map(line => +line.trim())
    return { ranges, items };
}

function part1(data) {
    return data.items.filter(item => data.ranges.some(range => item >= range[0] && item <= range[1])).length;
}

function part2(data) {
    // First, we merge all overlapping ranges
    const ranges = data.ranges.map(r => r.slice());
    for (let i = 0; i < ranges.length - 1; i++) {
        for (let j = i + 1; j < ranges.length; j++) {
            if (overlaps(ranges[i], ranges[j])) {
                if (within(ranges[i], ranges[j])) {
                    // First range fully in second -> remove it and skip rest of inner iteration
                    ranges.splice(i, 1);
                    i--;
                    break;
                } else if (within(ranges[j], ranges[i])) {
                    // Second range fully in first -> remove it and proceed
                    ranges.splice(j, 1);
                    j--;
                } else {
                    // Regular overlap -> merge them, skip rest of inner iteration and process first range again against all after it
                    ranges[i][0] = Math.min(ranges[i][0], ranges[j][0]);
                    ranges[i][1] = Math.max(ranges[i][1], ranges[j][1]);
                    ranges.splice(j, 1);
                    i--;
                    break;
                }
            }
        }
    }
    // Now we know that none of our ranges are overlapping, so we can just sum them up
    return ranges.map(r => r[1] - r[0] + 1).sum();
}

function overlaps(r1, r2) {
    return !(r2[1] < r1[0] || r2[0] > r1[1]);
}

function within(r1, r2) {
    return r1[0] >= r2[0] && r1[1] <= r2[1];
}

// Prepare data getters
const sampleData = () => prepareData(data0a || data0b);
const userData = () => prepareData(data1);

// Part 1
assertEqual("Part 1 works with example", part1(sampleData()), 3);
logTime("Part 1: ", () => part1(userData()));

// Part 2
assertEqual("Part 2 works with example", part2(sampleData()), 14);
logTime("Part 2: ", () => part2(userData()));