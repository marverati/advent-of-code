const Array2D = require('./dataStructures/Array2D');

const data0a = `...>...
.......
......>
v.....>
......>
.......
..vvv..`

const data0 = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`;

const { data1 } = require('./25data');

function prepareData(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line !== "");
    const map = new Array2D(lines[0].length, lines.length, (x, y) => ({ type: lines[y][x], willMove: null }));
    return map;
}

function part1(map) {
    console.log("Starting");
    let steps = 0;
    while (performStep(map) && steps < 999999) {
        steps++;
    }
    return steps + 1;
}

function performStep(map) {
    let moved = false;
    moved = moved || performDirection(map, ">", 1, 0);
    moved = performDirection(map, "v", 0, 1) || moved;
    return moved;
}

function performDirection(map, type, dx, dy) {
    // Get intention for all in parallel
    let moves = 0;
    map.forEachCell((obj, x, y) => {
        if (obj.type === type) {
            const nxt = getNext(map, x, y, dx, dy);
            obj.willMove = nxt.type === "." ? nxt : null;
            obj.willMove && moves++;
        }
    });
    // Move & reset intention
    if (moves > 0) {
        map.forEachCell((obj, x, y) => {
            if (obj.willMove) {
                // Move
                obj.willMove.type = obj.type;
                obj.type = '.';
                // Reset
                obj.willMove = null;
            }
        })
    }
    // Any move made?
    return moves > 0;
}

function getNext(map, x, y, dx, dy) {
    const nx = (x + dx) % map.w, ny = (y + dy) % map.h;
    return map.get(nx, ny);
}

const map = prepareData(data1);
console.log(map.toString(c => c.type));
console.log("---");
console.log("Part 1: ", part1(map));
console.log(map.toString(c => c.type));
