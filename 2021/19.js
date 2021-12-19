const { data0, data1 } = require('./19data');

// x = 1, y = 2, z = 3, -x = -1, -y = -2, -z = -3
const orientations = [
    [ 1,  2,  3], [ 1, -3,  2], [ 1, -2, -3], [ 1,  3, -2],
    [ 2, -1,  3], [ 2,  3,  1], [ 2,  1, -3], [ 2, -3, -1],
    [ 3,  2, -1], [ 3,  1,  2], [ 3, -2,  1], [ 3, -1, -2],
    [-1,  2, -3], [-1,  3,  2], [-1, -2,  3], [-1, -3, -2],
    [-2,  1,  3], [-2,  3, -1], [-2, -1, -3], [-2, -3,  1],
    [-3,  2,  1], [-3,  1, -2], [-3, -2, -1], [-3, -1,  2],
];

function getKey(pos) {
    return pos.x + "," + pos.y + "," + pos.z
}

let scannerCount = 0;

class Scanner {
    constructor() {
        this.index = scannerCount++;
        this.relBeacons = [];
        this.rotatedBeacons = [];
        this.beaconsByOrientation = orientations.map(v => []);
        this.pos = null;
        this.orientation = null; // value from 0...24
    }

    add(beacon) {
        this.relBeacons.push(beacon);
        for (let i = 0; i < orientations.length; i++) {
            this.beaconsByOrientation[i].push(Scanner.rotateBeacon(beacon, orientations[i]));
        }
    }

    overlapsWith(other) {
        // Optimization idea: add potentiallyOverlapsWith which only checks |x|+|y|+|z| to check if it's possibly an overlap
        for (let o = 0; o < orientations.length; o++) {
            const pos = this.overlapsWithOrientation(other, o)
            // console.log(o, ": ", pos);
            if (pos) {
                return {
                    pos,
                    orientation: o
                }
            }
        }
        return null;
    }

    overlapsWithOrientation(other, ownOrientation) {
        const overlapsRequired = 12;
        const otherBeacons = other.rotatedBeacons;
        if (!otherBeacons || otherBeacons.length === 0) {
            throw new Error("Checking overlap with not yet known other scanner which has no rotated beacons");
        }
        const ownBeacons = this.beaconsByOrientation[ownOrientation]
        const anchorsToCheck = ownBeacons.length - overlapsRequired + 2;
        const otherAnchorsToCheck = otherBeacons.length - overlapsRequired + 2;
        // TODO the line below could be stored once per scanner rather than executed on each test here
        const allOtherDiffKeys = otherBeacons
            .map(anchor => otherBeacons.map(bc => getKey({ x: bc.x - anchor.x, y: bc.y - anchor.y, z: bc.z - anchor.z})));
        for (let a = 0; a < anchorsToCheck; a++) {
            // Own (=unknown) beacon to check as anchor vs all other scanner's (=known) beacons 
            const anchor = ownBeacons[a];
            const ownDiffs = ownBeacons.map(bc => ({ x: bc.x - anchor.x, y: bc.y - anchor.y, z: bc.z - anchor.z }));
            const diffSet = new Set();
            ownDiffs.forEach(diff => diffSet.add(getKey(diff)));
            for (let b = 0; b < otherAnchorsToCheck; b++) {
                const anchor2 = otherBeacons[b];
                const otherDiffs = allOtherDiffKeys[b];
                const matchingDiffs = otherDiffs.filter(diffKey => diffSet.has(diffKey));
                if (matchingDiffs.length >= overlapsRequired) {
                    // Found the match!
                    return {
                        x: other.pos.x + anchor2.x - anchor.x,
                        y: other.pos.y + anchor2.y - anchor.y,
                        z: other.pos.z + anchor2.z - anchor.z
                    }
                }
            }
        }
        return null;
    }

    setOrientation(orientation) {
        this.orientation = orientation;
        const or = orientations[orientation];
        this.rotatedBeacons = this.relBeacons.map(beacon => Scanner.rotateBeacon(beacon, or));
    }

    static rotateBeacon({x, y, z}, orientation) {
        if (!orientation.length) { throw new Error("Illegal rotation"); }
        const result = {
            x: getValue(orientation[0]),
            y: getValue(orientation[1]),
            z: getValue(orientation[2])
        };
        return result;

        function getValue(axis) {
            const abs = Math.abs(axis)
            const v = (abs === 1) ? x : (abs === 2) ? y : z;
            return axis < 0 ? -v : v;
        }
    }
}

function prepareData(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line !== "");
    const scanners = [];
    let current = null;
    for (const line of lines) {
        if (line.startsWith("---")) {
            current = new Scanner();
            scanners.push(current);
        } else {
            const beacon = line.split(',').map(v => +v);
            current.add({x: beacon[0], y: beacon[1], z: beacon[2] || 0 });
        }
    }
    return scanners;
}

function bothParts(scanners) {
    // Assume first scanner at (0, 0) with default orientation
    scanners[0].pos = {x: 0, y: 0, z: 0};
    scanners[0].setOrientation(0)
    const [ first, ... unknown ] = scanners;
    known = [ first ];
    let changed = true;

    // Keep on searching for overlaps between known and unknown scanners as long as new ones are found
    while (scanners.length && changed) {
        changed = false;
        for (let s = unknown.length - 1; s >= 0; s--) {
            const scanner = unknown[s];
            for (const other of known) {
                const overlapInfo = scanner.overlapsWith(other)
                if (overlapInfo) {
                    // Found a match! Determine position and stuff
                    scanner.pos = overlapInfo.pos;
                    scanner.setOrientation(overlapInfo.orientation);
                    // Mark as known
                    known.push(scanner);
                    unknown.splice(s, 1);
                    changed = true;
                    console.log("Found", known.length, "/", scanners.length);
                    break;
                }
            }
        }
    }

    // Determine beacon positions
    const beaconSet = new Set();
    const allBeacons = [];
    for (const scanner of known) {
        for (const beacon of scanner.beaconsByOrientation[scanner.orientation]) {
            const x = scanner.pos.x + beacon.x,
                y = scanner.pos.y + beacon.y,
                z = scanner.pos.z + beacon.z;
            const key = x + "," + y + "," + z;
            if (!beaconSet.has(key)) {
                beaconSet.add(key);
                allBeacons.push({x, y, z});
            }
        }
    }

    console.log("Part 1: ", allBeacons.length);

    let maxDis = 0;
    for (let i = 0; i < scanners.length; i++) {
        const s1 = scanners[i].pos;
        for (let j = 0; j < scanners.length; j++) {
            if (i !== j) {
                const s2 = scanners[j].pos;
                const dis = Math.abs(s1.x - s2.x) + Math.abs(s1.y - s2.y) + Math.abs(s1.z - s2.z);
                if (dis > maxDis) { maxDis = dis; }
            }
        }
    }

    console.log("Part 2: ", maxDis);
}

const data = prepareData(data1);
const t0 = Date.now();
bothParts(data);
console.log("dt: ", Date.now() - t0);