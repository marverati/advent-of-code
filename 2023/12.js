require('./_helpers.js');
let { data0, data1 } = require('./12-data.js');
const { logTime, logProgress, range } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

// Very sorry but I'm not gonna clean this mess up :D

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => {
            const parts = line.split(' ');
            return {
                springs: parts[0],
                groups: parts[1].split(',').map(n => +n),
            }
        });
    return lines;
}

let used = 0;
function getOptions(line) {
    // Example: ?###???????? 3,2,1
    const memory = {};
    return getO(line.springs, 0, line.groups);

    function getO(s, i, groups, check = true) {
        // console.log('Checking ', s, i, groups);
        const hash = s.substring(0, i) + " " + groups.join(',');
        if (memory[hash] != null && false) {
            used++;
            return memory[hash];
        }
        if (check) {
            // If we find clear reason that s violates groups, return 0
            const curGroups = getGroups(s.substring(0, i));
            for (let i = 0; i < curGroups.length - 1; i++) {
                if (curGroups[i] !== groups[i]) {
                    memory[hash] = 0;
                    return 0;
                }
            }
            if (curGroups.last > groups[curGroups.length - 1]) {
                memory[hash] = 0;
                return 0;
            }
            // Not enough # symbols
            if (s.filter(c => c === '#' || c === '?').length < groups.sum()) {
                return 0;
            }
        }
        if (i >= s.length) {
            const curGroups = getGroups(s.substring(0, i));
            const valid = curGroups.length === groups.length && (curGroups.every((v, i) => v === groups[i])) ;
            const result = valid ? 1 : 0;
            memory[hash] = result;
            return result;
        }
        if (s[i] !== '?') {
            if (s[i] === '#') {
                // Regular recursion
                return getO(s, i + 1, groups, false);
            } else {
                // '.' means we can cut off beginning, to end up with reusable tail
                // console.log('. found at ', s, i);
                if (s.includes('#') && s.indexOf('#') < i) {
                    let count = s.substring(0, i).split('').filter(c => c === '#').length;
                    // console.log('  Cutting!', count, groups);
                    const newGroups = [];
                    for (const g of groups) {
                        if (count > 0) {
                            count -= g;
                            if (count < 0) { return 0; } // Invalid constellation
                        } else {
                            newGroups.push(g);
                        }
                    }
                    // console.log('  Cutting down from ', s, ' to ', s.substring(i + 1), 'and groups from ', groups, 'to', newGroups);
                    return getO(s.substring(i + 1), 0, newGroups, false);
                }
                // Regular recursion
                return getO(s, i + 1, groups, false);
            }
        } else {
            const pre = s.substring(0, i), post = s.substring(i + 1);
            // console.log('Checking for ', pre + 'X' + post);
            const result = getO(pre + '.' + post, i + 1, groups) + getO(pre + '#' + post, i + 1, groups);
            memory[hash] = result;
            return result;
        }
    }
}

function getGroups(s) {
    const groups = [];
    s += '.';
    let currentSize = 0;
    for (const c of s) {
        if (c === '.') {
            if (currentSize > 0) {
                groups.push(currentSize);
                currentSize = 0;
            }
        } else {
            currentSize++;
        }
    }
    return groups;
}

function part1(data) {
    const options = data.map(line => getOptions(line));
    console.log(options);
    return options.sum();
}

function part2(data, multiply) {
    let i = 0;
    const output = [];
    for (const line of data) {
        const values = [1, 2, 3, 4, 5].map(d => part2part([line], d)[0]);
        const fac = Math.floor(values.last / values[values.length - 2]);
        let fac2 = 0;
        let result = 0;
        if (fac === Math.floor(fac) || true) {
            result = values[multiply - 1] || (values[0] * fac ** multiply);
        } else {
            const t = Date.now();
            values.push(part2part([line], 3)[0]);
            const duration = Date.now() - t;
            if (duration * fac < 500) {
                values.push(part2part([line], 4)[0]);
            }
            fac2 = values.last / values[values.length - 2];
        }
        const factors = values.slice(0, values.length - 1).map((v, i) => values[i + 1] / v);
        fac2 = factors.last;
        result = values.last * fac2 ** (multiply - values.length);
        fac2 !== fac && console.log(i, { values, f: factors, result });
        output.push(Math.floor(result));
        i++;
    }
    console.log(output, output.sum());
    // const values = range(1, multiply).map(d => part2part(data, d));
    // console.log(values);
    // for (let i = 0; i < values[0].length; i++) {
    //     const row = values.map(v => v[i]);
    //     console.log(i, row, row.slice(0, row.length - 1).map((v, i) => row[i + 1] / v));
    // }
    let results = [0]; // results1.slice();
    // for (let m = 2; m <= multiply; m++) {
    //     results = results.map((v, i) => v * factors[i]);
    // }
    return output.sum();
}

function part2part(data, multiply = 1) {
    if (multiply > 0) {
        data = data.map((line, i) => {
            const g = line.groups;
            const groups = g.slice();
            for (let i = 1; i < multiply; i++) {
                groups.push(...g);
            }
            return {
                springs: range(0, multiply).map(v => line.springs).join('?'),
                groups,
            }
        });
    }
    // const options = data.map(line => getOptions(line));
    // return options.sum();

    const options = data.map((line, i) => {
        // Turn groups into string where # and . are necessary, and ~ and mean any number of . (0...many)
        // logProgress("", i, data.length);
        const t = Date.now();
        let s = '~' + line.groups.map(g => range(0, g).map(c => '#').join('')).join('.~') + '~';
        const result = countMatches(s, line.springs);
        // console.log(i, '/', data.length, line.springs, '||', s, result, 100 * i / data.length + "% - t = ", Date.now() - t);
        return result;
    });

    return options;
}

let memory = {}

function countMatches(s1, s2) {
    // Remove leading characters that are equal or forced
    while (s1.length > 0 && s2.length > 0 && (s1[0] === s2[0] || (s1[0] !== "~" && s2[0] === "?"))) { // <--- this made all the difference and caused my code to finally terminate
        s1 = s1.substring(1);
        s2 = s2.substring(1);
    }
    // s1 of shape ~#.~#.~###~
    // s2 of shape ???.###
    const hash = s1 + "|" + s2;
    if (memory[hash] != null) {
        return memory[hash];
    }
    const log = () => {}
    log('Comparing ', s1, s2);
    // approach: replace ~ with '', '.', '..', '...', etc. recursively
    const fixedCount = s1.filter(c => c !== '~').length;
    if (fixedCount > s2.length) {
        log('    nope 1');
        memory[hash] = 0;
        return 0;
    }
    if (fixedCount === s1.length) {
        // No ~ left, check match
        if (s1.length !== s2.length) {
            log('    nope 2');
            memory[hash] = 0;
            return 0;
        }
        for (let i = 0; i < s1.length; i++) {
            if (s2[i] !== '?' && s1[i] !== s2[i]) {
                log('    nope 3');
                memory[hash] = 0;
                return 0; // mismatch found
            }
        }
        log(s1, s2, '    works!');
        memory[hash] = 1;
        return 1;
    }
    const p = s1.indexOf('~');
    const max = p < 0 ? s2.length : p;
    for (let i = 0; i < max; i++) {
        if (s2[i] !== '?' && s1[i] !== s2[i]) {
            log('    nope 4');
            memory[hash] = 0;
            return 0; // mismatch found
        }
    }
    const s2remaining = s2.substring(p);
    const unknownRemaining = s2remaining.filter(c => c === '?').length;
    const pointsRemaining = s2remaining.filter(c => c === '.').length;
    const hashesRemaining = s2remaining.filter(c => c === '#').length;
    const knownHashes = s1.substring(p + 1).filter(c => c === '#').length;
    const knownPoints = s1.substring(p + 1).filter(c => c === '.').length;
    if (unknownRemaining + hashesRemaining < knownHashes) {
        log('    nope 5');
        memory[hash] = 0;
        return 0;
    }
    if (unknownRemaining + pointsRemaining < knownPoints) {
        log('    nope 6');
        memory[hash] = 0;
        return 0;
    }
    // Check match before ~
    // Still here -> there must be ~ left and it can match in principle
    const pre = s1.substring(0, p), post = s1.substring(p + 1);
    const maxCount = s2.length - fixedCount;
    let count = 0;
    for (let c = 0; c <= maxCount; c++) {
        const news1 = pre + range(0, c).map(v => '.').join('') + post;
        count += countMatches(news1, s2);
    }
    memory[hash] = count;
    return count;
}

const data = prepareData(data1); // .slice(38, 39);
(data.length < 50 || data instanceof Object) && console.log(data);
logTime("Part 1: ", () => part1(data));
console.log(used);
memory = {}
logTime("Part 2: ", () => part2(data, 5));