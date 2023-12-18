require('./_helpers.js');
const { data1 } = require('./18-data.js');
const { logTime, logProgress, floodFill } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0 = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`

// Part 2 directions: RDLU

// Part 2 example: single square with 5*7 cells, coveing 35 cells
const data2 = `
X 0 (#000040)
X 0 (#000061)
X 0 (#000042)
X 0 (#000063)
`

// Part 2 example: two rectangles between [0,0] and [5,3] covering total of 21 cells
const data3 = [
    [0, 5],
    [1, 3],
    [2, 2],
    [3, 1],
    [2, 3],
    [3, 2],
].map(el => `X 0 (#${el[1].toString(16).padStart(5, '0')}${el[0]})`).join('\n');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return lines;
}

function part1(data) {
    const map = new Array2D(1000, 1000, (x, y) => "");
    let x = map.w / 2, y = map.h / 2;
    let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
    for (const line of data) {
        const parts = line.split(' ');
        const dir = parts[0];
        const steps = +parts[1];
        const color = parts[2].substring(1, parts[2].length - 1);
        let dx = 0, dy = 0;
        switch (dir) {
            case "U": dy--; break;
            case "D": dy++; break;
            case "R": dx++; break;
            case "L": dx--; break;
        }
        for (let s = 0; s < steps; s++) {
            map[y][x] = color;
            x += dx;
            y += dy;
        }
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }

    // Fill
    for (let y = 0; y < map.h; y++) {
        let filled = false, count = 0;
        for (let x = 0; x < map.w; x++) {
            if (map[y][x] !== '') {
                count++;
            } else {
                if (filled) {
                    filled = false;
                }
                if (count === 1) {
                    filled = true;
                    floodFill({x,y}, (e) => {
                        const nbs = [];
                        map.forDirectNeighbors(e.x, e.y, (v, x, y) => map[y][x] === '' && nbs.push({x, y}));
                        return nbs;
                    }, ({x, y}) => map[y][x] = '#ffffff');
                }
            }
        }
    }

    return map.countCells(c => c !== '');
}

/*
Part 2 approach:
- go through instructions once and memorize all "real" coordinates
- then get sorted list of all x coordinates and all y coordinates
- then draw map as in part 1, but with each edge just covering cells equal to the amount of list indices they skip
    - to be precise, we take all coordinates by 2, which allows us to later sum up only the areas of the "inner" parts
- then flood fill inner area as before
- then for each filled cell, count it according to the multiplication of stored edge lengths
    - do some special magic for avoiding double counting of borders and corners
*/
function part2(data) {
    const map = new Array2D(2000, 2000, (x, y) => false);
    let x = 0, y = 0;
    const path = [{x:0,y:0}], xs = [0], ys = [0];
    for (const line of data) {
        const parts = line.split(' ');
        const color = parts[2].substring(1, parts[2].length - 1);
        const steps = parseInt(color.substring(1, 6), 16);
        const dir = "RDLU"[+color[6]];
        let dx = 0, dy = 0;
        switch (dir) {
            case "U": dy--; break;
            case "D": dy++; break;
            case "R": dx++; break;
            case "L": dx--; break;
        }
        x += dx * steps;
        y += dy * steps;
        path.push({x, y});
        !xs.includes(x) && xs.push(x);
        !ys.includes(y) && ys.push(y);
    }
    xs.sort((a, b) => a - b);
    ys.sort((a, b) => a - b);
    const xMap = {}, yMap = {};
    xs.forEach((x, i) => xMap[x] = i);
    ys.forEach((y, i) => yMap[y] = i);

    const times2 = 2;
    x = xMap[path[0].x] * times2; y = yMap[path[0].y] * times2;
    const ox = 10, oy = 10;
    let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
    for (const coord of path) {
        const nx = xMap[coord.x] * times2, ny = yMap[coord.y] * times2;
        const steps = Math.max(Math.abs(nx - x), Math.abs(ny - y));
        if (!steps) { continue; }
        for (let s = 0; s <= steps; s++) {
            const cx = Math.round(x + s * (nx - x) / steps);
            const cy = Math.round(y + s * (ny - y) / steps);
            map[oy + cy][ox + cx] = true;
            minX = Math.min(minX, cx + ox);
            minY = Math.min(minY, cy + oy);
            maxX = Math.max(maxX, cx + ox);
            maxY = Math.max(maxY, cy + oy);
        }
        x = nx;
        y = ny;
    }

    // Fill
    for (let y = 0; y < map.h; y++) {
        let filled = false, count = 0;
        for (let x = 0; x < map.w; x++) {
            if (map[y][x]) {
                count++;
            } else {
                if (filled) {
                    filled = false;
                }
                if (count === 1) {
                    filled = true;
                    floodFill({x,y}, (e) => {
                        const nbs = [];
                        map.forDirectNeighbors(e.x, e.y, (v, x, y) => !map[y][x] && nbs.push({x, y}));
                        return nbs;
                    }, ({x, y}) => map[y][x] = true);
                }
            }
        }
    }

    let countedTwice = 0;
    return map.reduceCells((sum, c, x, y) => {
        if (c && (x % 2) === 1 && (y % 2) === 1) {
            const ix = Math.floor((x - ox) / 2);
            const iy = Math.floor((y - oy) / 2);
            let w = xs[ix + 1] - xs[ix];
            let h = ys[iy + 1] - ys[iy];
            if (!map[y][x + 2]) { w++; gx = true; }
            if (!map[y + 2][x]) {
                h++;
                if (map[y + 2][x - 2]) {
                    countedTwice++; // special case of double counting
                }
            }
            return sum + w * h;
        }
        return sum;
    }, 0) - countedTwice;
}


const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));
