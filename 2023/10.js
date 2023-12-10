require('./_helpers.js');
const { data1 } = require('./10-data.js');
const { logTime, logProgress } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0 = `
.....
.S-7.
.|.|.
.L-J.
.....`;

const data0b = `
7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ
`;

const data0c = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`

const data0d = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

const connectsL = "S-J7";
const connectsR = "S-LF";
const connectsT = "S|LJ";
const connectsB = "S|7F";

function findPath(data, p) {
    const nodes = [p];
    let i = 0;
    const visited = new Set();
    visited.add(p.x + 99999 * p.y);
    while (i < nodes.length) {
        p = nodes[i];
        const cur = data.get(p.x, p.y);
        data.forDirectNeighbors(p.x, p.y, (v, nx, ny) => {
            const hash = nx + 99999 * ny;
            if (!visited.has(hash)) {
                if (v !== '.') {
                    // Check if connected
                    if (nx > p.x && connectsL.includes(v) && connectsR.includes(cur) ||
                        nx < p.x && connectsR.includes(v) && connectsL.includes(cur) ||
                        ny > p.y && connectsT.includes(v) && connectsB.includes(cur) ||
                        ny < p.y && connectsB.includes(v) && connectsT.includes(cur)) {
                        visited.add(hash);
                        nodes.push({x: nx, y: ny});
                    }
                }
            }
        });
        i++;
    }
    return nodes;
}

function getConnector(dx1, dy1, dx2, dy2) {
    if (dx1 === 0 && dx2 === 0) {
        return '|';
    } else if (dy1 === 0 && dy2 === 0) {
        return '-';
    } else if (dx1 > 0 && dy2 < 0 || dy1 < 0 && dx2 > 0) {
        return 'J';
    } else if (dx1 > 0 && dy2 > 0 || dy1 < 0 && dx2 < 0) {
        return '7';
    } else if (dx1 < 0 && dy2 > 0 || dy1 > 0 && dx2 < 0) {
        return 'F';
    } else if (dx1 < 0 && dy2 < 0 || dy1 > 0 && dx2 > 0) {
        return 'L';
    }
    return '?';
}

function part1(data) {
    const sPos = data.find((v) => v === 'S');
    const path = findPath(data, sPos);
    return path.length / 2;
}

function part2(data) {
    const sPos = data.find((v) => v === 'S');
    const path = findPath(data, sPos);
    // Replace S with proper pipe type
    const newS = getConnector(sPos.x - path[1].x, sPos.y - path[1].y, path[2].x - sPos.x, path[2].y - sPos.y);
    data.set(sPos.x, sPos.y, newS);

    // Create mask of path for O(1) access based on map position
    const isOnPath = data.map(_ => false);
    path.forEach(p => {
        isOnPath.set(p.x, p.y, true);
    })

    let insideCount = 0;
    data.forEachCell((v, x, y) => {
        // Positions on the path cannot be enclosed by the path
        if (isOnPath.get(x, y)) {
            return;
        }
        // Count path intersections when walking from here to the bottom right border of the map
        let nx = x + 1, ny = y + 1, count = 0;
        while (data.isInside(nx, ny)) {
            if (isOnPath.get(nx, ny)) {
                // Count only proper intersections; 7 and L would be tangential to our movement direction, so are skipped
                if ('-|FJ'.includes(data.get(nx, ny))) {
                    count++;
                }
            }
            // Walk down & right
            nx += 1;
            ny += 1;
        }
        // Odd number of path intersections means the given position we started from was "inside" the path
        if (count % 2 === 1) {
            insideCount++;
        }
    });

    return insideCount;
}

const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));