require('./_helpers.js');
const { data0, data1 } = require('./11data');
const { deepCopy } = require('./_util.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
    const monkeys = [];
    let monkeyNum = 0;
    for (let i = 0; i < lines.length; i += 7) {
        const monkey = {
            id: parseInt(lines[i].split(' ').last),
            items: lines[i + 1].split(' ').slice(2).map(v => parseInt(v)),
            op: lines[i + 2].split(' ').slice(-2)[0],
            factor: +lines[i + 2].split(' ').last,
            mod: +lines[i + 3].split(' ').last,
            trueTarget: +lines[i + 4].split(' ').last,
            falseTarget: +lines[i + 5].split(' ').last,
            inspections: 0
        };
        monkeys.push(monkey);
        monkeyNum++;
    }
    return monkeys;
}

function simulate(monkeys, rounds, divider) {
    monkeys = deepCopy(monkeys);
    const totalMod = monkeys.map(m => m.mod).product();
    for (let r = 0; r < rounds; r++) {
        // Each round, cycle through all monkeys in order
        for (const m of monkeys) {
            // inspect all items
            for (let i = 0; i < m.items.length; ) { // i remains 0, as m.items.length decreases each iteration
                m.inspections++;
                const other = isNaN(m.factor) ? m.items[0] : m.factor; // reference to old value, or an explicit number?
                m.items[0] = (m.op === '+') ? (m.items[0] + other) : (m.items[0] * other); // '+' or '*'
                if (divider != null) {
                    m.items[0] = Math.floor(m.items[0] / 3); // part 1
                } else {
                    m.items[0] = m.items[0] % totalMod; // part 2
                }
                // Throw item
                const target = m.items[0] % m.mod ? m.falseTarget : m.trueTarget;
                monkeys[target].items.push(m.items.shift());
            }
        }
    }

    // Return product of two largest numbers of inspections
    return monkeys.map(m => m.inspections).sort((a, b) => a - b).slice(-2).product();
}

const data = prepareData(data1);
console.log("Part 1: ", simulate(data, 20, 3));
console.log("Part 2: ", simulate(data, 10000, null));