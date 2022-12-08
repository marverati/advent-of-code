require('./_helpers.js');
const { data1 } = require('./08data');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    const map = new Array2D(lines[0].length, lines.length, (x, y) => +lines[y][x]);
    return map;
}

function part1(map) {
    return map.countCells((_v, x, y) => {
        return getDistances(map, x, y).some(dir => !dir.blocked)
    });
}

function part2(map) {
    return map.reduceCells(
        (best, _v, x, y) => Math.max(best, getDistances(map, x, y).map(v => v.dis).product()),
        0
    );
}

function getDistances(map, x0, y0) {
    const v = map[y0][x0];
    return [[-1, 0], [0, -1], [1, 0], [0, 1]].map(step => {
        let x = x0 + step[0], y = y0 + step[1];
        let dis = 0, blocked = false;
        while (map.isInside(x, y)) {
            dis++;
            if (map[y][x] >= v) {
                blocked = true;
                break;
            }
            x += step[0];
            y += step[1];
        }
        return { dis, blocked };
    })
}

const data = prepareData(data1);
(data.length < 50) && console.log(data.length);
console.info("Part 1: ", part1(data));
console.info("Part 2: ", part2(data));