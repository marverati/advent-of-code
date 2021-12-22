
const { data0a, data0b, data0c, data1, data2 } = require('./22data');

function prepareData(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line !== "");
    const rules = [];
    for (const line of lines) {
        const [ onOff, rest ] = line.split(' ');
        const isOn = onOff === 'on';
        const coords = rest.split(',');
        const obj = {};
        for (let i = 0; i < 3; i++) {
            const [val, range] = coords[i].split('=');
            const [from, to] = range.split('..');
            obj[val + '1'] = +from;
            obj[val + '2'] = +to;
        }
        rules.push({
            ... obj,
            on: isOn,
            small: allSmall(obj.x1, obj.x2, obj.y1, obj.y2, obj.z1, obj.z2)
        });
    }
    return rules;

    function allSmall(... values) {
        return Math.max( ... values.map(v => Math.abs(v)) ) <= 50;
    }
}

function part1(data) {
    const cubes = [];
    for (let z = 0; z < 101; z++) {
        cubes[z] = [];
        for (let y = 0; y < 101; y++) {
            cubes[z][y] = [];
            for (let x = 0; x < 101; x++) {
                cubes[z][y][x] = false; // off initially
            }
        }
    }
    for (const rule of data) {
        if (!rule.small) { continue; }
        const v = rule.on;
        for (let z = rule.z1; z <= rule.z2; z++) {
            const slice = cubes[z + 50];
            for (let y = rule.y1; y <= rule.y2; y++) {
                const row = slice[y + 50];
                for (let x = rule.x1; x <= rule.x2; x++) {
                    row[x + 50] = v;
                }
            }
        }
    }
    let count = 0;
    for (let z = 0; z < 101; z++) {
        for (let y = 0; y < 101; y++) {
            for (let x = 0; x < 101; x++) {
                (cubes[z][y][x]) && (count++);
            }
        }
    }
    return count;
}

function part2(data) {
    let count = part1(data);
    const largeRules = data.filter(rule => !rule.small);
    for (let i = 0; i < largeRules.length; i++) {
        if (largeRules[i].on) {
            count += getSelfOwnedCubesInside(largeRules, i, -Infinity, -Infinity, -Infinity, Infinity, Infinity, Infinity);
        }
    }
    return count;
}

function getSelfOwnedCubesInside(rules, i, x1, y1, z1, x2, y2, z2) {
    if (i >= rules.length) { return 0; }
    const rule = rules[i];
    x1 = Math.max(rule.x1, x1); x2 = Math.min(rule.x2, x2);
    y1 = Math.max(rule.y1, y1); y2 = Math.min(rule.y2, y2);
    z1 = Math.max(rule.z1, z1); z2 = Math.min(rule.z2, z2);
    if (x2 < x1 || y2 < y1 || z2 < z1) { return 0; }
    let count = (x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1);
    for (let j = i + 1; j < rules.length; j++) {
        if (overlaps(rule, rules[j])) {
            const num = getSelfOwnedCubesInside(rules, j, x1, y1, z1, x2, y2, z2);
            count -= num;
        }
    }
    return count;
}

function overlaps(r1, r2) {
    return !(
        r1.x1 > r2.x2 || r1.x2 < r2.x1 ||
        r1.y1 > r2.y2 || r1.y2 < r2.y1 ||
        r1.z1 > r2.z2 || r1.z2 < r2.z1
    );
}

const data = prepareData(data2);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));