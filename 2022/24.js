require('./_helpers.js');
const { data1 } = require('./24data');
const Array2D = require('./dataStructures/Array2D.js');

const data0 = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    const map = new Array2D(lines[0].length, lines.length, (x, y) => {
        const c = lines[y][x];
        if (c === '.') {
            return '.';
        } else if (c === '#') {
            return '#';
        } else {
            const r = [0, 0, 0, 0];
            r[ '>v<^'.indexOf(c) ]++;
            return r;
        }
    });
    return map;
}

function simulate(map) {
    let part1Solution = null;
    const start = [map[0].indexOf('.'), 0];
    const goal = [map.last.indexOf('.'), map.length - 1];

    const reachablePositions = [
        [
            new Array2D(map.w, map.h, (x, y) => x === start[0] && y === start[1]), // first phase: look for goal pos
            new Array2D(map.w, map.h, _ => false), // second phase: move back to starting pos
            new Array2D(map.w, map.h, _ => false), // third phase: back to goal pos
        ]
    ];

    for (let min = 1; min < 99999; min++) {
        // Update blizzards
        const old = map.map(v => v instanceof Array ? v.slice() : v);
        old.forEachCell((v, x, y) => {
            if (v instanceof Array) {
                // Move in all directions
                if (v[0] > 0) { // Right
                    map[y][x][0]--;
                    if (map[y][x + 1] !== '#') {
                        addBlizzard(x + 1, y, 0);
                    } else {
                        addBlizzard(1, y, 0);
                    }
                }
                if (v[1] > 0) { // Down
                    map[y][x][1]--;
                    if (map[y + 1][x] !== '#') {
                        addBlizzard(x, y + 1, 1);
                    } else {
                        addBlizzard(x, 1, 1);
                    }
                }
                if (v[2] > 0) { // Left
                    map[y][x][2]--;
                    if (map[y][x - 1] !== '#') {
                        addBlizzard(x - 1, y, 2);
                    } else {
                        addBlizzard(map.w - 2, y, 2);
                    }
                }
                if (v[3] > 0) { // Up
                    map[y][x][3]--;
                    if (map[y - 1][x] !== '#') {
                        addBlizzard(x, y - 1, 3);
                    } else {
                        addBlizzard(x, map.h - 2, 3);
                    }
                }
                // Turn into '.' if no blizzards are left on this cell
                if (map[y][x].every(v => v === 0)) {
                    map[y][x] = '.';
                }
            }
        });
        // Check new reachable positions
        // Part 2: Add starting points for phase 2 (go back to start) and 3 (find goal once again), if previous phase reached its goal in previus minute
        if (reachablePositions[min - 1][0][goal[1]][goal[0]]) {
            reachablePositions[min - 1][1][goal[1]][goal[0]] = true;
        }
        if (reachablePositions[min - 1][1][start[1]][start[0]]) {
            reachablePositions[min - 1][2][start[1]][start[0]] = true;
        }
        reachablePositions[min] = [];
        // Update all fields for the three phases
        for (let phase = 0; phase < 3; phase++) {
            const prev = reachablePositions[min - 1][phase];
            const newPositions = new Array2D(map.w, map.h, (x, y) => {
                // Only non-blizzard tiles are traversable
                if (map.get(x, y) === '.') {
                    // Check if any direct neighbours (or self) in previous iteration were reachable
                    for (const dir of [ [0,0], [-1,0], [1,0], [0,1], [0,-1] ]) {
                        if (prev.get(x + dir[0], y + dir[1])) {
                            return true;
                        }
                    }
                } 
                return false;
            });
            reachablePositions[min][phase] = newPositions;
        }

        // Part 1
        if (reachablePositions[min][0][goal[1]][goal[0]] && part1Solution == null) {
            part1Solution = min;
        }
        // Part 2
        if (reachablePositions[min][2][goal[1]][goal[0]]) {
            // All done, present results
            return {
                part1: part1Solution,
                part2: min
            };
        }
    }

    return null;

    function addBlizzard(x, y, dir) {
        if (map[y][x] === '.') {
            map[y][x] = [ 0, 0, 0, 0 ];
        }
        map[y][x][dir]++ 
    }
}


const data = prepareData(data1);
console.log("Result: ", simulate(data));