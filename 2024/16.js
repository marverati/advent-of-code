require('./_helpers.js');
const { data1 } = require('./16-data.js');
const { assertEqual, logTime, bfs, absMod } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const sample1 = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`

const sample2 = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`

const sample3 = `
#######
###S###
##...##
##.#.##
##...E#
#######`

const sample4 = `
###########
##S########
##.########
##....#####
##.##.#####
##.##.#####
##......###
#####.#.###
#####.#.###
#####....E#
###########
`

const dxs = [0, 1, 0, -1];
const dys = [-1, 0, 1, 0];

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

function part1(data) {
    const allPaths = getPaths(data);
    return allPaths.map(p => p.score).min();
}

function part2(data) {
    const allPaths = getPaths(data);
    const bestScore = allPaths.map(p => p.score).min();
    const bestPaths = allPaths.filter(path => path.score === bestScore);
    const cells = new Set();
    for (const p of bestPaths) {
        for (const cell of p.path) {
            cells.add(`${cell.x},${cell.y}`);
        }
    }
    return cells.size;
}

function getPaths(data) {
    const start = data.find(c => c === 'S');
    data.set(start.x, start.y, '.');
    const pos = {x: start.x, y: start.y, d: 1, cost: 0, path: [start]}; // Facing East
    const bestMap = data.map(v => Infinity);
    const allPaths = [];
    let num = 0;
    bfs(
        pos,
        p => {
            const nbs = [];
            const nx = p.x + dxs[p.d], ny = p.y + dys[p.d];
            tryAdd(nbs, nx, ny, p.d, p.cost + 1, p.path);
            const dl = absMod(p.d - 1, 4), dr = absMod(p.d + 1, 4);
            const lx = p.x + dxs[dl], ly = p.y + dys[dl];
            const rx = p.x - dxs[dl], ry = p.y - dys[dl];
            tryAdd(nbs, lx, ly, dl, p.cost + 1001, p.path);
            tryAdd(nbs, rx, ry, dr, p.cost + 1001, p.path);
            return nbs;
        },
        p => false,
        p => {
            if (data.get(p.x, p.y) === 'E') {
                allPaths.push({path: p.path, score: p.cost});
            }
        },
        p => num++,
    );
    return allPaths;

    function tryAdd(neighbors, x, y, d, cost, path) {
        const tile = data.get(x, y);
        if ((tile === '.' || tile === 'E') && cost < bestMap[y][x] + 1001) {
            neighbors.push({x, y, d, cost, path: [...path, {x,y}]});
            bestMap.set(x, y, Math.min(bestMap.get(x, y), cost));
        }
    }
}

assertEqual("Part 1 works with example", part1(prepareData(sample1)), 7036);
assertEqual("Part 2 works with example1", part2(prepareData(sample1)), 45);
assertEqual("Part 1 works with example", part1(prepareData(sample2)), 11048);
assertEqual("Part 2 works with example2", part2(prepareData(sample2)), 64);
assertEqual("Part 2 works with example3", part2(prepareData(sample3)), 6);
assertEqual("Part 2 works with example4", part2(prepareData(sample4)), 25);
console.log('All tests passed');

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));