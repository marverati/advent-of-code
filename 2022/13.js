require('./_helpers.js');
const { data0, data1 } = require('./13data');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
    const packets = [];
    for (let i = 0; i < lines.length; i += 3) {
        packets.push({
            left: JSON.parse(lines[i]),
            right: JSON.parse(lines[i + 1])
        });
    }
    return packets;
}

function part1(packets) {
    let sum = 0;
    packets.map(packet => isInOrder(packet.left, packet.right)).forEach((v, i) => v && (sum += (i + 1)));
    return sum;
}

function part2(packets1) {
    const add1 = "[[2]]", add2 = "[[6]]";
    const packets = [ JSON.parse(add1), JSON.parse(add2) ];
    packets1.forEach(data => packets.push(data.left, data.right));
    // bring packets into order
    packets.sort((a, b) => isInOrder(a, b) ? -1 : 1);
    const pos1 = packets.findIndex(v => JSON.stringify(v) === add1) + 1;
    const pos2 = packets.findIndex(v => JSON.stringify(v) === add2) + 1;
    return pos1 * pos2;
}

function isInOrder(p1, p2, i = 0) {
    // Both are numbers
    if (typeof p1 === "number" && typeof p2 === "number") {
        return p1 < p2 ? true : p1 === p2 ? null : false;
    }
    // one or both are lists -> convert the number into a list
    if (typeof p1 === "number") { p1 = [ p1 ]; }
    if (typeof p2 === "number") { p2 = [ p2 ]; }
    // both are lists now
    if (i >= p1.length) {
        return (i >= p2.length) ? null : true;
    }
    if (i >= p2.length) {
        return false;
    }
    // Recurse into first child
    const childResult = isInOrder(p1[i], p2[i], 0);
    if (childResult != null) {
        return childResult;
    }
    // Recurse into sibling
    return isInOrder(p1, p2, i + 1);
}


const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));