require('./_helpers.js');
const { data0, data1 } = require('./18data');
const { bfs } = require('./_util.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split(',').map(v => +v))
        .map(line => ({x: line[0], y: line[1], z: line[2]}));
    return lines;
}

function part1(data) {
    const cube = Array.create(50, () => Array.create(50, () => Array.create(50, false)));

    // Mark all cells as solid
    let minx = Infinity, miny = Infinity, minz = Infinity, maxx = 0, maxy = 0, maxz = 0;
    for (const d of data) {
        cube[d.z][d.y][d.x] = true;
        minx = Math.min(minx, d.x); maxx = Math.max(maxx, d.x);
        miny = Math.min(miny, d.y); maxy = Math.max(maxy, d.y);
        minz = Math.min(minz, d.z); maxz = Math.max(maxz, d.z);
    }
    // Count filled cells
    let area = 0;
    for (let z = minz; z <= maxz; z++) {
        for (let y = miny; y <= maxy; y++) {
            for (let x = minx; x <= maxx; x++) {
                if (cube[z][y][x]) {
                    if (z == 0 || !cube[z - 1][y][x]) { area++; }
                    if (!cube[z + 1][y][x]) { area++; }
                    if (!cube[z][y - 1][x]) { area++; }
                    if (!cube[z][y + 1][x]) { area++; }
                    if (!cube[z][y][x - 1]) { area++; }
                    if (!cube[z][y][x + 1]) { area++; }
                }
            }
        }
    }

    return area;
}

function part2(data) {
    const cube = Array.create(50, () => Array.create(50, () => Array.create(50, false)));

    // Mark all cells as solid
    let minx = Infinity, miny = Infinity, minz = Infinity, maxx = 0, maxy = 0, maxz = 0;
    for (const d of data) {
        cube[d.z + 1][d.y + 1][d.x + 1] = true;
        minx = Math.min(minx, d.x); maxx = Math.max(maxx, d.x);
        miny = Math.min(miny, d.y); maxy = Math.max(maxy, d.y);
        minz = Math.min(minz, d.z); maxz = Math.max(maxz, d.z);
    }
    let area = 0, count = 0;

    // Search through air around droplet, never crossing the surface boundary
    bfs(
        {x: 0, y: 0, z: 0}, // start position should be any air cell
        p => [[-1,0,0], [1,0,0], [0,-1,0], [0,1,0], [0,0,-1], [0,0,1]].map(off => { // generator function for searchable neighbor cells
                const nx = p.x + off[0], ny = p.y + off[1], nz = p.z + off[2];
                // Consider neighbors inside valid area
                if (nx >= 0 && ny >= 0 && nz >= 0 && nx <= maxx + 2 && ny <= maxy + 2 && nz <= maxz + 2) {
                    // Only flood fill through outer air, never inside the cube
                    if (cube[nz][ny][nx]) { return null; } else { return {x: nx, y: ny, z: nz}; }
                }
                return null;
            }).filter(v => v != null),
        p => false, // end condition; we don't want to stop search, but fill the whole available space, so always return false
        ({x,y,z}) => { // cell handler; this will be checked once for every air cell, so we count the adjacent lava cells
            count++;
            // Count sides of neighbors that are lava
            if (z > 0 && cube[z - 1][y][x]) { area++; }
            if (cube[z + 1][y][x]) { area++; }
            if (y > 0 && cube[z][y - 1][x]) { area++; }
            if (cube[z][y + 1][x]) { area++; }
            if (x > 0 && cube[z][y][x - 1]) { area++; }
            if (cube[z][y][x + 1]) { area++; }
        },
        p => `${p.x},${p.y},${p.z}` // mapping coordinates to a key string, so bfs function can avoid visiting same cell twice
    );

    return area;
}


const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));