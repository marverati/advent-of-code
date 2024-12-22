require('./_helpers.js');
const { data1 } = require('./22-data.js');
const { assertEqual, logTime, logProgress, absMod } = require('./_util.js');

const sample1 = `1
10
100
2024
`

function prepareData(data) {
    const lines = data.trim()
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => +line);
    return lines;
}

function part1(data) {
    for (let s = 0; s < 2000; s++) {
        data = data.map((v, i) => data[i] = secretStep(v));
    }
    return data.sum();
}

function secretStep(v) {
    v = pruneAndMix(v, v * 64);
    v = pruneAndMix(v, Math.floor(v / 32));
    v = pruneAndMix(v, v * 2048);
    return v;
}

function pruneAndMix(a, b) {
    return absMod(a ^ b, 16777216);
}

function part2(data) {
    console.log('Part 2: Searching...');
    let best = 0;
    const { monkeySeqs, bananas } = precalcSequences(data);
    const visited = {};
    while (true) {
        // Probabilistic approach, let's assume real answer is rather close to 0 than on the extreme values
        const a = Math.floor(Math.random() * Math.random() * 10) * (Math.random() < 0.5 ? 1 : -1);
        const b = Math.floor(Math.random() * Math.random() * 10) * (Math.random() < 0.5 ? 1 : -1);
        const c = Math.floor(Math.random() * Math.random() * 10) * (Math.random() < 0.5 ? 1 : -1);
        const d = Math.floor(Math.random() * Math.random() * 10) * (Math.random() < 0.5 ? 1 : -1);
        const seq = `${a}${b}${c}${d}`;
        if (visited[seq]) {
            continue;
        }
        if (Math.abs(a) <= 5 && Math.abs(b) <= 5 && Math.abs(c) <= 5 && Math.abs(d) <= 5) { // can't store *all* combinations, so only limited set of small enough ones, to prevent most frequent duplicates
            visited[seq] = true;
        }
        let sum = 0;
        for (let j = 0; j < monkeySeqs.length; j++) {
            const mseq = monkeySeqs[j];
            const currentBananas = bananas[j];
            const i = findIndex(mseq, seq);
            if (i >= 0) {
                sum += +currentBananas[i + seq.length - 1];
            }
        }
        if (sum > best) {
            best = sum;
            console.log('Found new best', best, 'from sequence', seq);
        }
    }
}

function findIndex(s, sub) {
    let from = -1;
    while (true) {
        const i = s.indexOf(sub, from);
        if (i < 0) {
            return -1;
        }
        if (s[i - 1] === '-') {
            // If we just search for substring, we get false positives where the first number was actually negative; we rule that out here
            from = i + 1;
        } else {
            return i;
        }
    }
}

function precalcSequences(data) {
    let lastPrice = 0;
    const monkeySeqs = [];
    const bananas = [];
    data.map(v => {
        let monkeyPrices = '';
        let priceString = '';
        for (let s = 0; s < 2000; s++) {
            v = secretStep(v);
            const price = absMod(v, 10);
            const diff = price - lastPrice;
            lastPrice = price;
            monkeyPrices += diff;
            priceString += price;
            if (diff < 0) { priceString += price; } // ensure characters align per index
        }
        monkeySeqs.push(monkeyPrices);
        bananas.push(priceString);
    });
    return { monkeySeqs, bananas };
}

const sampleData = () => prepareData(sample1);
assertEqual("Sample 1", part1(sampleData()), 37327623)

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));