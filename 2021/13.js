const Array2D = require("./dataStructures/Array2D");
const { data0, data1 } = require('./13data');

function prepareData(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line !== "");
    const dotLines = lines.filter(line => line.indexOf(",") >= 0);
    const foldLines = lines.filter(line => line.startsWith("fold along "));
    const coords = dotLines.map(line => line.split(',').map(v => +v));
    // Find map size
    const maxX = coords.reduce((max, c) => Math.max(c[0], max), 0) + 1;
    const maxY = coords.reduce((max, c) => Math.max(c[1], max), 0) + 1;
    // Create map and read data
    const map = new Array2D(maxX, maxY, (x, y) => false);
    for (const c of coords) {
        map.set(c[0], c[1], true);
    }
    // Read folds
    const folds = foldLines.map(l => l.substr(11).split("="));
    folds.forEach(fold => fold[1] = +fold[1]);
    return {
        map, // boolean[][]
        folds // ['x'|'y': number][]
    };
}

function part1(map, folds) {
    map = performFold(map, folds[0]);
    return map.countCells(v => v);
}

function part2(map, folds) {
    for (const fold of folds) {
        map = performFold(map, fold);
    }
    return map.toString(c => c ? "#" : " ");
}

function performFold(map, fold) {
    if (fold[0] === 'x') {
        // right to left
        const w = fold[1];
        map = new Array2D(w, map.h, (x, y) => map.get(x, y) || map.get(2 * w - x, y));
    } else {
        // bottom up
        const h = fold[1];
        map = new Array2D(map.w, h, (x, y) => map.get(x, y) || map.get(x, 2 * h - y));
    }
    return map;
}

const { map, folds } = prepareData(data1);
console.log("Part1: ", part1(map, folds));
console.log("Part2:\n" + part2(map, folds));