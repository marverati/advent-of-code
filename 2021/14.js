const Array2D = require("./dataStructures/Array2D");
const { data0, data1 } = require('./14data');

function prepareData(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line !== "");
    const template = lines[0];
    const ruleLines = lines.slice(1);
    const rules = ruleLines.map(line => line.split(' -> ')).map(v => ({ from: v[0], to: v[1] }));
    return { template, rules };
}

function part1({template, rules}, steps = 10) {
    const els = {};
    for (const c of template) {
        els[c] = true;
    }
    for (const rule of rules) {
        els[rule.to] = true;
    }
    const elements = Object.keys(els).map(key => ({
        el: key,
        count: countChars(template, key)
    }));
    for (let i = 0; i < steps; i++) {
        template = performStep1(template, rules);
    }
    for (const el of elements) { el.count = countChars(template, el.el); }
    elements.sort((a, b) => a.count - b.count);
    return elements[elements.length - 1].count - elements[0].count;
}

function part2({template, rules}, steps = 40) {
    rules.forEach(rule => rule.count = 0);
    // Initial counts
    for (let i = 1; i < template.length; i++) {
        const s = template.substr(i - 1, 2);
        const rule = rules.find(r => r.from === s);
        rule && rule.count++;
    }
    const charCounts = {};
    for (const char of template) {
        if (!charCounts[char]) { charCounts[char] = 0; }
        charCounts[char]++;
    }
    
    // Perform steps
    for (let i = 0; i < steps; i++) {
        rules = performStep2(rules, charCounts);
    }
    const values = Object.values(charCounts);
    const max = Math.max(...values), min = Math.min(...values);

    return max - min;
}

function performStep2(rules, charCounts) {
    const other = rules.map(rule => ({ from: rule.from, to: rule.to, count: 0}));
    for (const rule of rules) {
        if (rule.count === 0) { continue; }
        const to1 = rule.from[0] + rule.to, to2 = rule.to + rule.from[1];
        const r1 = rules.findIndex(r => r.from === to1);
        const r2 = rules.findIndex(r => r.from === to2);
        if (!charCounts[rule.to]) {charCounts[rule.to] = 0;}
        charCounts[rule.to] += rule.count;
        if (r1 >= 0) {
            other[r1].count += rule.count;
        }
        if (r2 >= 0) {
            other[r2].count += rule.count;
        }
    }
    return other;
}

function performStep1(template, rules) {
    for (let i = 1; i < template.length; i++) {
        const c1 = template[i - 1], c2 = template[i];
        for (const rule of rules) {
            if (rule.from[0] === c1 && rule.from[1] === c2) {
                template = template.substr(0, i) + rule.to + template.substr(i);
                i++;
                break;
            }
        }
    }
    return template;
}

function countChars(s, c) {
    let count = 0;
    for (const char of s) {
        if (char === c) {
            count++;
        }
    }
    return count;
}


const data = prepareData(data1);
console.log(part1(data, 10));
console.log(part2(data, 40));