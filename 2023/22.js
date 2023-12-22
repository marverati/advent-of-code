require('./_helpers.js');
const { data1 } = require('./22-data.js');
const { logTime, logProgress, deepCopy } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0 = `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map((line, i) => {
            const parts = line.split("~");
            const c1 = parts[0].split(",");
            const c2 = parts[1].split(",");
            return {
                name: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i] || i, // just for debugging
                from: {x: +c1[0], y: +c1[1], z: +c1[2] },
                to: { x: +c2[0], y: +c2[1], z: +c2[2] },
                onGround: +c1[2] === 1,
                restingOn: new Set(), // will be populated during initial falling update
                supporting: new Set(), // will be populated during initial falling update
            }
        })
    return lines;
}

function part1(bricks) {
    fallDown(bricks);
    const canDisintegrate = bricks.filter(b => b.supporting.every(other => other.restingOn.size > 1));
    return canDisintegrate.length;
}

function fallDown(bricks) {
    bricks.sort((a, b) => a.from.z - b.from.z); // sort them by height so we start with lowest ones and thus have less work to do
    let changed = 1;
    while (changed > 0) {
        changed = 0;
        for (const b of bricks) {
            if (b.onGround || b.restingOn.size > 0) { continue; }
            const { z, rest } = findLowestZ(bricks, b);
            if (z !== b.from.z || rest.length > 0) {
                changed++;
                // Move down brick itself
                const diff = b.from.z - z;
                b.from.z -= diff;
                b.to.z -= diff;
                b.onGround = b.from.z === 1;
                // Adjust restingOn/supporting relations with other bricks
                if (diff !== 0) {
                    for (const other of b.supporting) {
                        other.restingOn.remove(b);
                    }
                    b.supporting = new Set();
                }
                b.restingOn = new Set(rest);
                for (const other of rest) {
                    other.supporting.add(b);
                }
            }
        }
    }
}

function findLowestZ(bricks, b) {
    // Collect candidate bricks that b could collide with by moving down
    const candidates = bricks.filter(other => other !== b && b.from.x <= other.to.x && b.to.x >= other.from.x
                && b.from.y <= other.to.y && b.to.y >= other.from.y && b.from.z >= other.from.z);
    let lowestZ = 1;
    let prevCollisions = [];
    while (lowestZ < b.from.z) {
        const collisions = collides(lowestZ, b.to.z);
        if (collisions.length === 0) {
            return {z: lowestZ, rest: prevCollisions};
        }
        prevCollisions = collisions;
        lowestZ++; // Possible optimization: binary search over lower z coordinate rather than stepping up linearly
    }
    return { z: b.from.z, rest: prevCollisions };

    function collides(fz, tz) {
        const collisions = candidates.filter(other => {
            const outside = fz > other.to.z || tz < other.from.z;
            return !outside;
        });
        return collisions;
    }
}

function part2(bricks) {
    // Bricks are already fallen down from part 1
    const chains = bricks.map(b => getChainLength(b));
    return chains.sum();
}

function getChainLength(b) {
    const removed = new Set([b]);
    const toCheck = new Set(b.supporting);
    let changes = 1;
    while (changes > 0) {
        changes = 0;
        for (const other of toCheck) {
            if (other.restingOn.every(o => removed.has(o))) {
                toCheck.delete(other);
                removed.add(other);
                for (const top of other.supporting) {
                    if (!removed.has(top) && !toCheck.has(top)) {
                        toCheck.add(top);
                    }
                }
                changes++;
            }
        }
    }
    return removed.size - 1;
}


const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));