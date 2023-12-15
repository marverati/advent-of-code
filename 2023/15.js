require('./_helpers.js');
const { data1 } = require('./15-data.js');
const { logTime, logProgress, range } = require('./_util.js');

const data0 = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return lines[0].split(',');
}

function getHash(s) {
    let current = 0;
    for (const c of s) {
        const asciiValue = c.charCodeAt(0);
        current += asciiValue;
        current *= 17;
        current %= 256;
    }
    return current;
}

function part1(data) {
    return data.map(v => getHash(v)).sum();
}

function part2(steps) {
    const boxes = range(0, 256).map(r => ({lenses: []}));
    for (const step of steps) {
        const s = step.replace('=', ' = ').replace('-', ' - ') // make string easier to split
        const parts = s.split(' ');
        const label = parts[0];
        const operator = parts[1];
        const focal = parts[2];
        const boxIndex = getHash(label);
        const box = boxes[boxIndex];
        if (operator === '=') {
            // Add/replace lens
            const li = box.lenses.findIndex(l => l.label === label);
            if (li >= 0) {
                box.lenses[li].focal = +focal;
            } else {
                box.lenses.push({label, focal});
            }
        } else {
            // Remove lense
            const li = box.lenses.findIndex(l => l.label === label);
            if (li >= 0) {
                box.lenses.splice(li, 1);
            }
        }
    }
    const boxPowers = boxes.map((box, boxIndex) =>
        box.lenses.map((l, lenseIndex) => getFocusingPower(l, boxIndex, lenseIndex)).sum());
    return boxPowers.sum();
}

function getFocusingPower(l, boxIndex, lenseIndex) {
    return (boxIndex + 1) * (lenseIndex + 1) * l.focal;
}

const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));