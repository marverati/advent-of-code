require('./_helpers.js');
const { data0: data0a, data1 } = require('./23-data.js');
const { logTime, logProgress } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0b = `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`
const data2 = `
#.####
#....#
#.##.#
#..#.#
#.##.#
#.#..#
#.#.##
#.#..#
#.##.#
#....#
####.#
`

const data3 = `
#.######
#.#...##
#.#.#.##
#......#
###.##.#
##..##.#
##.###.#
##.....#
######.#
`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

function part1(data) {
    ignoreSlopes = false;
    const start = {y: 0, x: data[0].findIndex(v => v !== '#')};
    const goal = {y: data.h1, x: data[data.h1].findIndex(v => v !== '#')};

    const path = getLongestPath(data, start, goal);

    return path.length - 1;
}

function getLongestPath(data, start, goal) {
    const paths = findAllPaths(data, start, goal);
    const max = Math.max(...paths.map(p => p.length));
    const path = paths.find(p => p.length === max);
    return path;
}

function part2(data) {
    ignoreSlopes = true;
    const start = {y: 0, x: data[0].findIndex(v => v !== '#')};
    const goal = {y: data.h1, x: data[data.h1].findIndex(v => v !== '#')};

    const criticalTiles = findCriticalTiles(data, start, goal);
    return monteCarloSearch(criticalTiles, 1000000);
}

function findAllPaths(data, start, goal) {
    const paths = [
        {path: [start], visited: new Set([hashPos(start)]), done: false, success: false},
    ];
    const hashGoal = hashPos(goal);

    const maxSteps = Infinity;
    let i = 0;

    while (paths.some(p => !p.done) && i++ < maxSteps) {
        const pathCount = paths.length;
        const removePathIndices = [];
        for (let p = 0; p < pathCount; p++) {
            const path = paths[p];
            if (!path.done) {
                const pos = path.path.last;
                path.visited.add(hashPos(pos));
                if (hashPos(pos) === hashGoal) {
                    // Found end
                    path.success = true;
                    path.done = true;
                    continue;
                }
                // Spread out
                const nbs = getNeighbors(data, pos).filter(pos => !path.visited.has(hashPos(pos)));
                if (nbs.length === 0) {
                    // Dead end
                    path.success = false;
                    path.done = true;
                    removePathIndices.push(p);
                    continue;
                } else {
                    for (let i = 1; i < nbs.length; i++) {
                        // Branch out
                        const newPath = path.path.slice();
                        newPath.push(nbs[i]);
                        paths.push({
                            path: newPath,
                            visited: new Set(path.visited),
                        });
                    }
                    // Continue this path
                    path.path.push(nbs[0]);
                }
            }
        }
        // Remove dead ends
        for (let i = removePathIndices.length - 1; i >= 0; i--) {
            const ind = removePathIndices[i];
            paths.splice(ind, 1);
        }
    }

    return paths.filter(path => path.success).map(path => path.path);
}

function findCriticalTiles(data, start, goal) {
    const criticalPositions = [start];
    data.forEachCell((v, x, y) => {
        if (v !== '#' && getNeighbors(data, {x, y}).length > 2) {
            criticalPositions.push({x, y});
        }
    });
    criticalPositions.push(goal);

    const criticalTiles = criticalPositions.map(p => ({
        pos: p,
        connections: [], // { tile: CriticalTile, distance: number}
    }));

    for (const t of criticalTiles) {
        const targets = findConnectedCriticalTiles(t.pos);
        t.connections = targets.map(target => {
            const ct = criticalTiles.find(ct => ct.pos.x === target.pos.x && ct.pos.y === target.pos.y);
            return {
                tile: ct,
                distance: target.distance,
            };
        });
    }

    return criticalTiles;

    function findConnectedCriticalTiles(pos0) {
        const result = [];
        const nbs = getNeighbors(data, pos0);
        for (const firstStep of nbs) {
            let prev = pos0;
            let pos = firstStep;
            let dis = 1;
            while (true) {
                if (pos.x === start.x && pos.y === start.y || pos.x === goal.x && pos.y === goal.y) {
                    result.push({pos, distance: dis});
                    break;
                }
                const nbs = getNeighbors(data, pos).filter(nb => nb.x !== prev.x || nb.y !== prev.y);
                if (nbs.length > 1) {
                    // Found critical tile
                    result.push({pos, distance: dis});
                    break;
                } else if (nbs.length === 1) {
                    // Move on
                    prev = pos;
                    pos = nbs[0];
                    dis++;
                } else {
                    throw new Error("This should not happen");
                }
            }
        }
        return result;
    }
}

function hashPos(pos) {
    return data.w * pos.y + pos.x;
}

function monteCarloSearch(criticalTiles, maxTries = Infinity) {
    let maxDis = 0;
    const hGoal = hashPos(criticalTiles.last.pos);

    let i = 0;
    while(i++ < maxTries) {
        logProgress("", i, maxTries);
        path = tryPath(criticalTiles);
        if (hashPos(path.last.targetPos) === hGoal) {
            // console.log('Valid path of length ', path.last.totalDistance);
            const dis = path.reduce((sum, part) => sum + part.distance, 0);
            if (dis > maxDis) {
                maxDis = dis;
                console.log('Better path found: ', dis, path.length);
            }
        }
    }

    return maxDis;

    function tryPath() {
        const path = [];
        let ct = criticalTiles[0];
        const visited = new Set();
        let distance = 0;
        while (true) {
            visited.add(ct);
            const options = ct.connections.filter(con => !visited.has(con.tile));
            if (options.length === 0) {
                // Path ended
                break;
            }
            const weights = options.map(o => o.distance);
            const weightSum = weights.sum();
            let selector = Math.random() * weightSum;
            let selected = options[0];
            for (const o of options) {
                selector -= o.distance;
                if (selector <= 0) {
                    // Choose this option
                    selected = o;
                    break;
                }
            }
            // Apply option
            distance += selected.distance;
            ct = selected.tile;
            path.push({
                target: ct,
                targetPos: ct.pos,
                distance: selected.distance,
                totalDistance: distance,
            });
        }
        return path;
    }
}

function getNeighbors(data, pos) {
    const nbs = [];
    const {x, y} = pos;
    const c = data[pos.y][pos.x];
    if (c === '.' || ignoreSlopes && c !== '#') {
        data.forDirectNeighbors(pos.x, pos.y, (v, x, y) => {
            nbs.push({x, y});
        });
    } else if (c === '<') {
        nbs.push({x: x - 1, y});
    } else if (c === '>') {
        nbs.push({x: x + 1, y});
    } else if (c === 'v') {
        nbs.push({x, y: y  +1});
    } else if (c === '^') {
        nbs.push({x, y: y - 1});
    }
    return nbs.filter(pos => data.isInside(pos.x, pos.y) && data[pos.y][pos.x] !== '#');
}

let ignoreSlopes = false;
const data0 = data0a || data0b;


const data = prepareData(data1);
// (data.length < 50 || data instanceof Object) && console.log(data);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));
// 3722 is too low