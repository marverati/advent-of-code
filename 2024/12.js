require('./_helpers.js');
const { data0, data1 } = require('./12-data.js');
const { assertEqual, logTime, floodFill } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

function calculatePrices(data, countSides) {
    const visited = new Set();
    const perimeters = new Map();
    const areas = new Map();
    const roots = new Set();
    data.forEachCell((v, cx, cy) => {
        if (visited.has(hash(cx, cy))) {
            return;
        }
        // Set up this cell as root of an area
        const root = hash(cx, cy);
        roots.add(root);
        perimeters.set(root, 0);
        areas.set(root, 0);
        // Spread out from here
        floodFill(
            {x: cx, y: cy}, 
            ({x,y}) => {
                // Get all direkt neighbors that have same value (& were not visited before)
                const nbs = data.directNeighborOffsets.map((off) =>
                    ({x: x+off[0], y: y+off[1]}))
                    .filter(({x: nx, y: ny}) => data.isInside(nx, ny)
                        && !visited.has(hash(nx, ny))
                        && data.get(nx, ny) === data.get(x, y));
                return nbs;
            },
            (cell) => {
                const {x, y} = cell;
                visited.add(hash(x, y));
                const v = data.get(x, y);
                let perimeter = 0;
                // Calculate this cell's perimeter
                data.directNeighborOffsets.forEach((off) => {
                    const nx = x + off[0];
                    const ny = y + off[1];
                    if (!data.isInside(nx, ny) || data.get(nx, ny) !== v) {
                        if (countSides) {
                            // Only count perimeter of the "first" cell in each direction, which gives us the "sides"
                            const selfX = x + off[1], selfY = y - off[0];
                            const otherX = selfX + off[0], otherY = selfY + off[1];
                            const selfV = data.get(selfX, selfY);
                            const otherV = data.get(otherX, otherY);
                            if (!(selfV === v && otherV !== v)) {
                                perimeter++;
                            }
                        } else {
                            // Count perimeter of each cell individually
                            perimeter++;
                        }
                    }
                });
                // Add perimeter + area to the area's root
                perimeters.set(root, perimeters.get(root) + perimeter);
                areas.set(root, areas.get(root) + 1);
            },
            ({x, y}) => hash(x, y),
        );
    });

    return [...roots].map(root => areas.get(root) * perimeters.get(root)).sum();

    function hash(x, y) {
        return `${x},${y}`;
    }
}

const part1 = (data) => calculatePrices(data, false);
const part2 = (data) => calculatePrices(data, true);

const sampleData = () => prepareData(data0);
assertEqual("Part 1 works with example", part1(sampleData()), 140);
assertEqual("Part 2 works with example", part2(sampleData()), 80);

const userData = () => prepareData(data1);
logTime("Part 1: ", () => part1(userData()));
logTime("Part 2: ", () => part2(userData()));