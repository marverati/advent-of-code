require('./_helpers.js');
const { data1 } = require('./17-data.js');
const { logTime, logProgress, range } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0 = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => +lines[y][x]);
}

function getDir(dx, dy) {
    return dx === 1 ? 'r' : dx === -1 ? 'l' : dy === 1 ? 'b' : 't';
}

function fromDir(dir) {
    return dir === 'r' ? {x:1,y:0} : dir === 'l' ? {x:-1,y:0} : dir === 'b' ? {x:0,y:1} : {x:0,y:-1};
}

function computePath(data, minSteps, maxSteps) {
    // gradually build up new map, representing minimum heat loss up to this particular point
    // taking constraints into account
    const totalCells = data.countCells();
    const minLoss = data.map(v => []);
    let frontier = [ {x:0, y:0} ];
    minLoss[0][0].push({loss: 0, path: ""});
    while (frontier.length) {
        logProgress("", minLoss.countCells(c => c.length > 0) - frontier.length, totalCells);
        const nbs = new Set();
        // Prepare next frontiert
        for (const pos of frontier) {
            const pnbs = data.forDirectNeighbors(pos.x, pos.y, (v, x, y) => {
                const p = x + data.w * y;
                nbs.add(p);
            });
        }
        frontier = [...nbs.values()].map(v => ({x: v % data.w, y: Math.floor(v / data.w)}));
        // Update frontier based on surroundings
        for (let i = frontier.length - 1; i >= 0; i--) {
            const pos = frontier[i];
            const newCandidates = [];
            minLoss.forDirectNeighbors(pos.x, pos.y, (v, x, y) => {
                const dx = pos.x - x, dy = pos.y - y;
                const dir = getDir(dx, dy);
                const oppositeDir = getDir(-dx, -dy);
                const minimalInvalidEnding = range(0, maxSteps).map(_ => dir).join('');
                for (const p of minLoss[y][x]) {
                    const lastChar = p.path.substr(-1);
                    const validEndingForDirectionChange = minSteps > 0 ? range(0, minSteps).map(_ => lastChar).join('') : '';
                    if (!p.path.endsWith(minimalInvalidEnding)
                        && !p.path.endsWith(oppositeDir)
                        && (p.path.endsWith(validEndingForDirectionChange) || dir === p.path.substr(-1))
                    ) {
                        newCandidates.push({loss: p.loss + data[y][x], path: p.path + dir});
                    }
                }
            })
            let changed = false;
            if (newCandidates.length > 0) {
                const oldPaths = minLoss[pos.y][pos.x].map(v => v.path).join('|');
                minLoss[pos.y][pos.x].push(...newCandidates);
                // Sort out suboptimal paths
                const best = Math.min(...minLoss[pos.y][pos.x].map(v => v.loss));
                const threshold = best + 10; // Just guessed... is there an actually safe threshold to set from which we can ignore worse local results?
                minLoss[pos.y][pos.x] = minLoss[pos.y][pos.x].filter((v, i) => {
                    const ending = v.path.substr(-maxSteps);
                    if (v.loss > threshold) {
                        return false;
                    }
                    const better = minLoss[pos.y][pos.x].find(w => w.path.substr(-maxSteps) === ending && w.loss < v.loss);
                    const equal = minLoss[pos.y][pos.x].findIndex(w => w.path.substr(-maxSteps) === ending && w.loss === v.loss);
                    return !better && equal === i;
                });
                const newPaths = minLoss[pos.y][pos.x].map(v => v.path).join('|');
                changed = newPaths !== oldPaths;
            }
            if (!changed) {
                // No improvement means we don't have to update neighbors of this cell
                frontier.splice(i, 1);
            }
        }
    }

    // Compute actual weights of best path
    const result = minLoss[data.h1][data.w1];
    result.sort((a, b) => a.loss - b.loss);
    const steps = result[0].path.split("").map(d => fromDir(d));
    const coords = [{x: 0, y: 0}];
    for (const step of steps) {
        coords.push({x: coords.last.x + step.x, y: coords.last.y + step.y});
    }
    const weights = coords.map(c => data[c.y][c.x]);
    return weights.slice(1).sum();
}

function part1(data) {
    return computePath(data, 0, 3);
}

function part2(data) {
    return computePath(data, 4, 10);
}


const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));