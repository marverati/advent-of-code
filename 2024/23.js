require('./_helpers.js');
const { sample1, data1 } = require('./23-data.js');
const { assertEqual, logTime, logProgress } = require('./_util.js');

function prepareData(data) {
    const lines = data
        .trim()
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split('-'));
    const connections = {};
    for (const line of lines) {
        const [a, b] = line;
        if (!connections[a]) { connections[a] = []; }
        if (!connections[b]) { connections[b] = []; }
        connections[a].push(b);
        connections[b].push(a);
    }
    return connections;
}

function part1(connections) {
    const groups = [];
    const comps = Object.keys(connections);
    for (const c of comps) {
        const nbs = connections[c];
        for (const n of nbs) {
            if (n < c) { continue; } // only check in one alphabetical direction to prevent duplicates
            for (const m of nbs) {
                if (m === n || m < n || m < c) { continue; } // only check in one alphabetical direction to prevent duplicates
                if (connections[n].includes(m)) {
                    groups.push([c, n, m]);
                }
            }
        }
    }
    return groups.filter(g => g.some(c => c.startsWith('t'))).length;
}

function part2(connections) {
    const bigSets = [];
    const comps = Object.keys(connections);
    for (const c of comps) {
        const sets = [];
        const nbs = connections[c].filter(n => n > c); // only check in one alphabetical direction to prevent duplicates
        for (const n of nbs) {
            const set = sets.find(s => s.every(m => connections[n].includes(m)));
            if (set) {
                set.push(n); // add to existing set
            } else {
                sets.push([n]); // start new set
            }
        }
        if (sets.length > 0) {
            sets.sort((a, b) => b.length - a.length);
            sets[0].unshift(c); // c so far was missing in these sets
            bigSets.push(sets[0]);
        }
    }
    bigSets.sort((a, b) => b.length - a.length);
    return bigSets[0].sort().join(',');
}


const sampleData = () => prepareData(sample1);
assertEqual("Sample 1", part1(sampleData()), 7);
assertEqual("Sample 1", part2(sampleData()), 'co,de,ka,ta');

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));