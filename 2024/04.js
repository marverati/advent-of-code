require('./_helpers.js');
const { data0: data0a, data1 } = require('./04-data.js');
const { logTime, logProgress } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

const allDirections = [
    [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]
];

function part1(data) {
    let count = 0;
    for (let y = 0; y < data.h; y++) {
        for (let x = 0; x < data.w; x++) {
            if (data[y][x] === 'X') {
                for (const d of allDirections) {
                    if (check(data, x, y, d, 1, 'M')
                        && check(data, x, y, d, 2, 'A')
                        && check(data, x, y, d, 3, 'S')
                    ) {
                        count++;
                    }
                }
            }
        }
    }
    return count;

    function check(data, x, y, d, l, char) {
        x += d[0] * l;
        y += d[1] * l;
        return (data[y] && data[y][x] === char) === true;
    }
}

function part2(data) {
    let count = 0;
    for (let y = 1; y < data.h1; y++) {
        for (let x = 1; x < data.w1; x++) {
            if (data[y][x] === 'A') {
                const others = [
                    data[y - 1][x - 1],
                    data[y + 1][x - 1],
                    data[y + 1][x + 1],
                    data[y - 1][x + 1],
                ];
                if (others.slice().sort().join('') === 'MMSS'
                    && others[0] !== others[2]
                    && others[1] !== others[3]
                ) {
                    count++;
                }
            }
        }
    }
    return count;
}


const data0 = data0a || data0b;
const data = prepareData(data1);
(data.length < 50 || data instanceof Object && !(data instanceof Array)) && console.log('Data:', data);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));