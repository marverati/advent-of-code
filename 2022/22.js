require('./_helpers.js');
const { data1 } = require('./22data');
const Array2D = require('./dataStructures/Array2D.js');
const { absMod } = require('./_util.js');

const data0 = `
        ...#    
        .#..    
        #...    
        ....    
...#.......#    
........#...    
..#....#....    
..........#.    
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        // .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines

    const arr = new Array2D(lines[5].length, lines.length - 1, (x, y) => lines[y][x] || ' ');
    const password = lines.last;
    return {
        map: arr,
        password
    };
}

const dirs = [ [1,0], [0,1], [-1,0], [0,-1] ];

const cubeCells = `-16 -4- 35- 2--`.split(' '); // based on data1 - cube rotation is not not solved for example data0

function traverse({map, password}, isCube) {
    // Start pos
    let y = 0;
    let x = map[y].indexOf('.');
    let dir = 0;

    const steps = splitPassword(password);

    for (const step of steps) {
        applyStep2(step);
    }

    return 1000 * (y + 1) + 4 * (x + 1) + dir;

    function applyStep2(step) {
        if (step === 'R' || step === 'L') {
            // Change direction
            dir = absMod(dir + (step === 'R' ? 1 : -1), 4);
        } else {
            // Move n steps in current direction
            for (let i = 0; i < step; i++) {
                let nx = x + dirs[dir][0], ny = y + dirs[dir][1];
                if (!map.isInside(nx, ny) || map[ny][nx] === ' ') {
                    // Wrap around map
                    if (isCube) {
                        // Part 2: Cube wrapping
                        const newPos = getCubeWrap(x, y, dirs[dir][0], dirs[dir][1]);
                        nx = newPos.x;
                        ny = newPos.y;
                        if (map[ny][nx] === '.') { // <--- forgetting this if condition has cost me so much time :D :(
                            dir = newPos.dir;
                        }
                    } else {
                        // Part 1: Simple wrap-around
                        let tx = x - 200 * dirs[dir][0], ty = y - 200 * dirs[dir][1];
                        while (!map.isInside(tx, ty) || map[ty][tx] === ' ') { tx += dirs[dir][0]; ty += dirs[dir][1]; }
                        nx = tx; ny = ty;
                    }
                }
                if (map[ny][nx] === '.') {
                    // Move one step forward
                    x = nx;
                    y = ny;
                } else if (map[ny][nx] === '#') {
                    // Stop at wall
                    break;
                } else {
                    throw new Error("Unknown map tile: ", map[ny][nx]);
                }
            }
        }
    }

    function getCubeSide(x, y) {
        const cellSize = Math.min(map.w, map.h) / 3;
        const cx = Math.floor(x / cellSize), cy = Math.floor(y / cellSize);
        return +cubeCells[cy][cx];
    }

    function getCubeWrap(x, y, dx, dy) {
        const side = getCubeSide(x, y);
        if (!(side >= 1 && side <= 6)) {
            throw new Error("Invalid side: " + side);
        }
        switch (side) {
            case 1: // top
                if (dy < 0) {
                    // 2 (Back) from left, x -> y
                    return { x: 0, y: 150 + (x % 50), dir: 0, side: 2 };
                } else if (dx < 0) {
                    // 3 (Left) from left, y -> -y
                    return { x: 0, y: 149 - (y % 50), dir: 0, side: 3 }; // check
                }
                break;
            case 2: // back
                if (dy > 0) {
                    // 6 (Right) from top, x -> x
                    return { x: 2 * 50 + (x % 50), y: 0, dir: 1, side: 6 };
                } else if (dx > 0) {
                    // 5 (Bottom) from bottom, y -> x
                    return { x: 50 + (y % 50), y: 149, dir: 3, side: 5 };
                } else if (dx < 0) {
                    // 1 (Top) from top, y -> x
                    return { x: 50 + (y % 50), y: 0, dir: 1, side: 1 };
                }
                break;
            case 3: // left
                if (dx < 0) {
                    // 1 (Top) from left, y -> -y
                    return { x: 50, y: 49 - (y % 50), dir: 0, side: 1 };
                } else if (dy < 0) {
                    // 4 (Front) from left, x -> y
                    return { x: 50, y: 50 + (x % 50), dir: 0, side: 4 };
                }
                break;
            case 4: // front
                if (dx < 0) {
                    // 3 (Left) from top, y -> x
                    return { x: y % 50, y: 100, dir: 1, side: 3 }
                } else if (dx > 0) {
                    // 6 (Right) from bottom, y -> x
                    return { x: 100 + (y % 50), y: 49, dir: 3, side: 6 };
                }
                break;
            case 5: // bottom
                if (dx > 0) {
                    // 6 (Right) from right, y -> -y
                    return { x: 149, y: 49 - (y % 50), dir: 2, side: 6 };
                } else if (dy > 0) {
                    // 2 (Back) from right, x -> y
                    return { x: 49, y: 150 + (x % 50), dir: 2, side: 2 };
                }
                break;
            case 6: // right
                if (dy < 0) {
                    // 2 (Back) from bottom, x -> x
                    return { x: x % 50, y: 199, dir: 3, side: 2 };
                } else if (dy > 0) {
                    // 4 (Front) from right, x -> y
                    return { x: 99, y: 50 + (x % 50), dir: 2, side: 4 };
                } else if (dx > 0) {
                    // 5 (Bottom) from right, y -> -y
                    return { x: 99, y: 149 - (y % 50), dir: 2, side: 5 };
                }
                break;
        }
        throw new Error("No match!");
    }
}

function splitPassword(pw) {
    const steps = [];
    let cur = 0;
    for (let i = 0; i < pw.length; i++) {
        const c = pw[i];
        if (c === "R" || c === "L") {
            steps.push(cur);
            steps.push(c);
            cur = 0;
        } else {
            cur = 10 * cur + (+c);
        }
    }
    if (cur != 0) {
        steps.push(cur);
    }
    return steps;
}

const data = prepareData(data1);
console.log("Part 1: ", traverse(data));
console.log("Part 2: ", traverse(data, true));