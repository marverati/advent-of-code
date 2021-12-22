

const { data0a, data0b, data0c, data1, data2 } = require('./22data');
const data0 = data0c;

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
            obj[val] = { from: +from, to: +to };
        }
        rules.push({
            on: isOn,
            x: obj.x,
            y: obj.y,
            z: obj.z,
            small: allSmall(obj.x.from, obj.x.to, obj.y.from, obj.y.to, obj.z.from, obj.z.to)
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
        for (let z = rule.z.from; z <= rule.z.to; z++) {
            const slice = cubes[z + 50];
            for (let y = rule.y.from; y <= rule.y.to; y++) {
                const row = slice[y + 50];
                for (let x = rule.x.from; x <= rule.x.to; x++) {
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

/*
    Look at all on-turning rules
    Check all overlapping rules that come after
*/

function part2(data) {
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
        for (let z = rule.z.from; z <= rule.z.to; z++) {
            const slice = cubes[z + 50];
            for (let y = rule.y.from; y <= rule.y.to; y++) {
                const row = slice[y + 50];
                for (let x = rule.x.from; x <= rule.x.to; x++) {
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
    const largeRules = data.filter(rule => !rule.small);
    for (let i = 0; i < largeRules.length; i++) {
        for (let j = i + 1; j < largeRules.length; j++) {
            if (overlap(largeRules[i], largeRules[j])) {
                const subRules = splitRules(largeRules[i], largeRules[j]);
                largeRules.splice(i, 1, subRules);
                // Restart for previous rule
                i--
                break;
                // TODO make it work :D
            }
        }
    }
    return count;
}

function overlap(r1, r2) {
    return !(
        r1.x.from > r2.x.to || r1.x.to < r2.x.from ||
        r1.y.from > r2.y.to || r1.y.to < r2.y.from ||
        r1.z.from > r2.z.to || r1.z.to < r2.z.from
    );
}

function splitRules(r1, r2) {
    let hasCorner = false, hasEdge = false;
    // r1 will be split, and r2 part will be left out of it
    const corners = getCorners(r2);
    for (const c of corners) {
        if (isPointInside(r1, c)) {
            // Split into 8 sub cubes, minus 1
            console.log("point inside");
            hasCorner = true;
            // TODO
        }
    }
    if (!hasCorner) {
        // Look for edge instead
        const edges = getEdges(r2);
        for (const e of edges) {
            if (isEdgeInside(r1, e)) {
                // Split into 4 sub cubes, minus 1
                console.log("edge inside");
                hasEdge = true;
                // TODO
            }
        }
        if (!hasEdge) {
            // Look for surface area halving the original cube
            const faces1 = getFaces(r1), faces2 = getFaces(r2);
            for (let i = 0; i < faces1.length; i++) {
                if (isFaceInside(faces1[i], faces2[i])) {
                    console.log("face inside");
                    // Split into 2 sub cubes, minus 1
                    // TODO
                }
            }
        }
    }
}

function getCorners(r) {
    return [
        { x: r.x.from, y: r.y.from, z: r.z.from },
        { x: r.x.from, y: r.y.from, z: r.z.to },
        { x: r.x.from, y: r.y.to, z: r.z.from },
        { x: r.x.from, y: r.y.to, z: r.z.to },
        { x: r.x.to, y: r.y.from, z: r.z.from },
        { x: r.x.to, y: r.y.from, z: r.z.to },
        { x: r.x.to, y: r.y.to, z: r.z.from },
        { x: r.x.to, y: r.y.to, z: r.z.to },
    ]
}

function isPointInside(rule, p) {
    return (
        p.x >= rule.x.from && p.x <= rule.x.to &&
        p.y >= rule.y.from && p.y <= rule.y.to &&
        p.z >= rule.z.from && p.z <= rule.z.to
    );
}

function getEdges(r) {
    const result = [
        { x: r.x.from, y: r.y.from, z1: r.z.from, z2: r.z.to, dir: "z" },
        { x: r.x.from, y: r.y.to,   z1: r.z.from, z2: r.z.to, dir: "z" },
        { x: r.x.to,   y: r.y.from, z1: r.z.from, z2: r.z.to, dir: "z" },
        { x: r.x.to,   y: r.y.to,   z1: r.z.from, z2: r.z.to, dir: "z" },
        { z: r.z.from, y: r.y.from, x1: r.x.from, x2: r.x.to, dir: "x" },
        { z: r.z.from, y: r.y.to,   x1: r.x.from, x2: r.x.to, dir: "x" },
        { z: r.z.to,   y: r.y.from, x1: r.x.from, x2: r.x.to, dir: "x" },
        { z: r.z.to,   y: r.y.to,   x1: r.x.from, x2: r.x.to, dir: "x" },
        { z: r.z.from, x: r.x.from, y1: r.y.from, y2: r.y.to, dir: "y" },
        { z: r.z.from, x: r.x.to,   y1: r.y.from, y2: r.y.to, dir: "y" },
        { z: r.z.to,   x: r.x.from, y1: r.y.from, y2: r.y.to, dir: "y" },
        { z: r.z.to,   x: r.x.to,   y1: r.y.from, y2: r.y.to, dir: "y" },
    ];
    result.forEach(obj => {
        if (obj.x1 == null) { obj.x1 = obj.x2 = obj.x; }
        if (obj.y1 == null) { obj.y1 = obj.y2 = obj.y; }
        if (obj.z1 == null) { obj.z1 = obj.z2 = obj.z; }
    });
    return result;
}

function isEdgeInside(rule, e) {
    switch (e.dir) {
        case "x":
            return e.z >= rule.z.from && e.z <= rule.z.to && e.y >= rule.y.from && e.y <= rule.y.to && (e.x1 < rule.x.from) === (e.x2 > rule.x.from);
        case "y":
            return e.x >= rule.x.from && e.x <= rule.x.to && e.z >= rule.z.from && e.z <= rule.z.to && (e.y1 < rule.y.from) === (e.y2 > rule.y.from);
        case "z":
            return e.x >= rule.x.from && e.x <= rule.x.to && e.y >= rule.y.from && e.y <= rule.y.to && (e.z1 < rule.z.from) === (e.z2 > rule.z.from);
    }
    throw new Error("Unknown direction: " + e.dir);
}

function getFaces(r) {
    return [
        { x1: r.x.from, y1: r.y.from, x2: r.x.to, y2: r.y.to, dir: "z" },
        { x1: r.x.from, z1: r.z.from, x2: r.x.to, z2: r.z.to, dir: "y" },
        { z1: r.z.from, y1: r.y.from, z2: r.z.to, y2: r.y.to, dir: "x" }
    ]; // 3 suffice because overlap check will be done independently of third axis, so opposite faces are identical
}

function isFaceInside(f1, f2) {
    if (f1.dir !== f2.dir) {
        throw new Error("Faces pointing in different directions: " + f1 + " !== " + f2);
    }
    switch (f1.dir) {
        case "x":
            return f2.z1 <= f1.z1 && f2.z2 >= f2.z2 && f2.y1 <= f1.y1 && f2.y2 >= f1.y2;
        case "y":
            return f2.x1 <= f1.x1 && f2.x2 >= f2.x2 && f2.z1 <= f1.z1 && f2.z2 >= f1.z2;
        case "z":
            return f2.x1 <= f1.x1 && f2.x2 >= f2.x2 && f2.y1 <= f1.y1 && f2.y2 >= f1.y2;
    }
    throw new Error("Unknown direction: " + f1.dir);
}

const data = prepareData(data0);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));