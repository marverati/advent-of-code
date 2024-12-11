require('./_helpers.js');
const { data1 } = require('./11-data.js');
const { assertEqual, logTime } = require('./_util.js');

function prepareData(data) {
    return data.split(" ").map(v => +v);
}

function applyRule(num) {
    let s;
    if (num === 0) {
        return [1];
    } else if ((s = `${num}`).length % 2 === 0)  {
        const mid = s.length / 2;
        return [ +s.slice(0, mid), +s.slice(mid) ];
    } else {
        return [num * 2024];
    }
}

function calculateStones(data, blinks) {
    let stones = new Map();
    // Move initial stones into map structure
    for (const num of data) {
        addStones(num, 1);
    }
    // Perform the desired number of blinks
    for (let i = 0; i < blinks; i++) {
        const nums = stones.keys();
        const newStones = [];
        // Apply rule to all current stones
        for (const num of nums) {
            const count = stones.get(num);
            const result = applyRule(num);
            newStones.push([result, count]);
        }
        // Reset old stones map and replace with updated one
        stones = new Map();
        for (const entry of newStones) {
            const count = entry[1];
            for (const num of entry[0]) {
                addStones(num, count);
            }
        }
    }
    // Count final stones
    return [...stones.values()].sum();

    function addStones(num, count) {
        if (!stones.has(num)) {
            stones.set(num, count);
        } else {
            stones.set(num, stones.get(num) + count);
        }
    }
}

assertEqual("Part 1 works with example", calculateStones(prepareData('125 17'), 25), 55312);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => calculateStones(userData(), 25));
logTime("Part 2: ", () => calculateStones(userData(), 75));