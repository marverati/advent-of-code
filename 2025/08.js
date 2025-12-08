require('./_helpers.js');
const { data0: data0a, data1 } = require('./08-data.js');
const { logTime, assertEqualSoft, assert } = require('./_util.js');

const data0b = `
162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split(',').map(v => +v));
    lines.isTestData = (data !== data1);
    return lines;
}

function connectCircuits(data, endCondition) {
    // Set up data structure where each junction box points to itself as the root of its circuit initially
    const boxes = data.map(d => ({ root: null, pos: d, nxt: null, circuit: null }));
    for (const box of boxes) { box.root = box; }

    // Iterate all pairs of junction boxes (undirected) and store their distance
    const distances = [];
    for (let i = 1; i < data.length; i++) {
        for (let j = 0; j < i; j++) {
            const dx = data[j][0] - data[i][0], dy = data[j][1] - data[i][1], dz = data[j][2] - data[i][2];
            const dis = dx * dx + dy * dy + dz * dz; // technically squared distance, but order will be the same
            distances.push({i, j, dis});
        }
    }
    // Sort distances shortest to longest
    distances.sort((a, b) => a.dis - b.dis);

    // Keep connecting closest two junction boxes until provided endCondition is met
    let circuitCount = boxes.length;
    for (let d = 0; d < distances.length; d++) {
        // Connect
        const {i, j} = distances[d];
        const b1 = boxes[j], b2 = boxes[i];
        if (b1.root !== b2.root) {
            circuitCount--;
            const c1 = getCircuit(b1.root);
            const c2 = getCircuit(b2.root);
            for (const other of c2) {
                other.root = b1.root;
            }
            // Connect
            c1.last.nxt = c2[0];
        }
        // Test for end condition
        if (endCondition(d + 1, circuitCount, b1, b2)) {
            break;
        }
    }

    // Write circuits to boxes for easier usage
    const circuits = [];
    for (const box of boxes) {
        if (!box.root.circuit) {
            box.root.circuit = getCircuit(box.root);
            circuits.push(box.root.circuit);
        }
        box.circuit = box.root.circuit;
    }

    return { boxes, circuits }

    function getCircuit(root) {
        assert("Is root", root === root.root);
        // keeps collecting root.nxt^n until a falsy value is encountered
        return root.traverseChain('nxt');
    }
}

function part1(data) {
    const maxConnections = data.isTestData ? 10 : 1000;
    const result = connectCircuits(data, (d) => d >= maxConnections);

    // Get all circuits, sort longest to shortest, and multiply longest three
    const circuitLengths = result.circuits.map(c => c.length);
    circuitLengths.sort((a, b) => b - a); 
    return circuitLengths.slice(0, 3).product();
}

function part2(data) {
    let result = NaN;
    connectCircuits(data, (d, circuitCount, b1, b2) => {
        if (circuitCount === 1) {
            result = b1.pos[0] * b2.pos[0]; // Multiply x coordinates of last connection made
        }
        return !isNaN(result); // only trigger end condition once we found the result
    });
    return result;
}

// Prepare data getters
const sampleData = () => prepareData(data0a || data0b);
const userData = () => prepareData(data1);

// Part 1
assertEqualSoft("Part 1 works with example", part1(sampleData()), 40);
logTime("Part 1: ", () => part1(userData()));

// Part 2
assertEqualSoft("Part 2 works with example", part2(sampleData()), 25272);
logTime("Part 2: ", () => part2(userData()));