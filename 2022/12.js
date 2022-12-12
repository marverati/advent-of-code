require('./_helpers.js');
const { data0, data1 } = require('./12data');
const Array2D = require('./dataStructures/Array2D.js');
const { bfs } = require('./_util.js');

let startPos, endPos;

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    const map = new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
    startPos = map.find(v => v === 'S')
    endPos = map.find(v => v === 'E');
    map[startPos.y][startPos.x] = String.fromCharCode('a'.charCodeAt(0) - 1);
    map[endPos.y][endPos.x] = String.fromCharCode('z'.charCodeAt(0) + 1);
    return map;
}

function part1(map) {
    let x = startPos.x, y = startPos.y;
    const path = bfs(
        {x, y},
        ({x, y}) => {
            let nbs = [], maxh = map[y][x].charCodeAt(0) + 1;
            map.forDirectNeighbors(x, y, (v, nx, ny) => map[ny][nx].charCodeAt(0) <= maxh && nbs.push({x: nx, y: ny}));
            return nbs;
        },
        obj => obj.x === endPos.x && obj.y === endPos.y,
        el => {},
        el => el.x + ',' + el.y,
    )
    return path && path.length;
}

function part2(map) {
    let x = endPos.x, y = endPos.y;
    const path = bfs(
        {x, y},
        ({x, y}) => {
            let nbs = [], minh = map[y][x].charCodeAt(0) - 1;
            map.forDirectNeighbors(x, y, (v, nx, ny) => map[ny][nx].charCodeAt(0) >= minh && nbs.push({x: nx, y: ny}));
            return nbs;
        },
        obj => map[obj.y][obj.x] === 'a',
        el => {},
        el => el.x + ',' + el.y,
    )
    return path && path.length;
}


const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));