
const data0 = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

const { data1 } = require('./15data');
const Array2D = require('./dataStructures/Array2D');

function prepareData(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line !== "");
    const map = new Array2D(lines[0].length, lines.length, (x, y) => +lines[y][x]);
    return map;
}

function findLowRiskPath(map, repeats = 5) {
    if (repeats && repeats > 1) {
        map = repeatMap(map, repeats);
    }
    const riskMap = map.map(v => Infinity);
    riskMap[0][0] = 0;
    const steps = map.w + map.h + 3;
    for (let s = 0; s < steps; s++) {
        steps > 200 && (s % 10 == 0) && console.log(s, "/", steps);
        const old = riskMap.slice();
        for (let y = 0; y < map.h; y++) {
            for (let x = 0; x < map.w; x++) {
                const nbs = [
                    old[y][x],
                    old[y - 1] ? old[y - 1][x] : null,
                    old[y + 1] ? old[y + 1][x] : null,
                    old[y][x - 1],
                    old[y][x + 1]
                ].filter(v => v != null);
                riskMap[y][x] = Math.min(Math.min(... nbs) + map[y][x], riskMap[y][x]);
            }
        }
    }
    return riskMap.get(riskMap.w - 1, riskMap.h - 1);
}

function repeatMap(map, repeat) {
    const newMap = new Array2D(map.w * repeat, map.h * repeat, (x, y) => {
        const tx = Math.floor(x / map.w), ty = Math.floor(y / map.h);
        let v = map[y % map.h][x % map.w] + tx + ty;
        while (v > 9) { v -= 9; }
        return v;
    });
    return newMap;
}

function getPath(riskMap) {
    let p = { x: riskMap.w - 1, y: riskMap.h - 1 };
    const path = [{ ... p }];
    while (p.x > 0 || p.y > 0) {
        // Find best predecessor
        if (p.x === 0) {
            p.y--;
        } else if (p.y === 0) {
            p.x--;
        } else if ((riskMap.get(p.x - 1, p.y) || Infinity) <= (riskMap.get(p.x, p.y - 1) || Infinity)) {
            p.x--;
        } else {
            p.y--;
        }
        path.unshift({ ... p });
    }
    return path;
}

const data = prepareData(data0);
console.log("Part 1: ", findLowRiskPath(data, 1));
console.log("Part 2: ", findLowRiskPath(data, 5));