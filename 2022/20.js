require('./_helpers.js');
const { data1 } = require('./20data');
const { absMod } = require('./_util.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => +line);
    return lines;
}

function mixData(data, preMultiply = 1, iterations = 1) {
    data = data.map(v => v * preMultiply);
    // De-duplicate the numbers
    data.forEach(v => {
        const i = data.indexOf(v);
        let num = 0;
        while (true) {
            const j = data.lastIndexOf(v);
            if (j === i) { break; }
            num++;
            data[j] += num / 64; // currently works for limited count of max 64 duplicates per number
        }
    })
    const initial = data.slice();
    // Perform n mixing iterations
    for (let m = 0; m < iterations; m++) {
        // Mix the whole list once
        for (let i = 0; i < initial.length; i++) {
            const num = initial[i];
            const index = data.indexOf(num);
            const trg = absMod(index + Math.floor(num), data.length - 1);
            // Adjust array
            if (index !== trg) {
                data.splice(index, 1);
                data.splice(trg, 0, num);
            }
        }
    }
    // Calculate result
    const p = data.indexOf(0);
    const values = [
        data[(p + 1000) % data.length],
        data[(p + 2000) % data.length],
        data[(p + 3000) % data.length],
    ].map(v => Math.floor(v));
    return values.sum();
}

const data = prepareData(data1);
(data.length < 50) && console.log(data.join(','));
console.log("Part 1: ", mixData(data));
console.log("Part 2: ", mixData(data, 811589153, 10));