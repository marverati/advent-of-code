require('./_helpers.js');
const { data0, data1 } = require('./05-data.js');
const { logTime, assertEqual } = require('./_util.js');


function prepareData(data) {
    const parts = data.split('\n\n');
    const rules = parts[0]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line != "")
        .map(line => line.split('|').map(v => +v));
    const updates = parts[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line != "")
        .map(line => line.split(',').map(v => +v));
    return { rules, updates }
}

function part1(data) {
    let sum = 0;
    for (const update of data.updates) {
        if (checkUpdate(update, data.rules)) {
            sum += update[(update.length - 1) / 2];
        }
    }
    return sum;
}

function checkUpdate(update, rules) {
    const posInUpdate = update.toObject(); // flips mapping around, so maps former values to keys
    return !rules.some(([v1, v2]) => posInUpdate[v1] > posInUpdate[v2]);
}

function part2(data) {
    let sum = 0;
    for (const update of data.updates) {
        if (reorderUpdate(update, data.rules)) {
            sum += update[(update.length - 1) / 2];
        }
    }
    return sum;
}

function reorderUpdate(update, rules) {
    posInUpdate = update.toObject(); // flips mapping around, so maps former values to keys
    const relevantRules = rules.filter(r => posInUpdate[r[0]] >= 0);
    let changed = false;
    while (true) {
        let recentChanges = 0;
        for (const [v1, v2] of relevantRules) {
            if (posInUpdate[v1] > posInUpdate[v2]) {
                recentChanges++;
                // Swap the two steps of the update
                const i = posInUpdate[v1], j = posInUpdate[v2];
                const tmp = update[i];
                update[i] = update[j];
                update[j] = tmp;
                posInUpdate[v1] = j;
                posInUpdate[v2] = i;
            }
        }
        // If changes were made, we need to re-check all rules, as the order changed and others might be violated now
        if (!recentChanges) { break; } else { changed = true; }
    }
    return changed;
}

const sampleData = prepareData(data0);
assertEqual("Part 1 works with example", part1(sampleData), 143);
assertEqual("Part 2 works with example", part2(sampleData), 123);

const userData = prepareData(data1);
logTime("Part 1: ", () => part1(userData));
logTime("Part 2: ", () => part2(userData));