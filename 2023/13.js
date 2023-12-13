require('./_helpers.js');
const { data1 } = require('./13-data.js');
const { logTime, logProgress } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const maps = data
        .split("\n\n") // turn into array of maps
        .map(map => map.split("\n").map(line => line.trim()).filter(line => line != "")) // turn single map into array of lines
        .map(map => new Array2D( // and then into proper 2D Array
            map[0].length,
            map.length,
            (x, y) => map[y][x])
        ) // trim white space
    return maps;
}

function getReflectionValue(map, minErrors, maxErrors) {
    for (let x = 0.5; x < map.w - 1; x++) {
        if (isMirrored(map, x)) {
            return Math.ceil(x);
        }
    }
    const t = map.transpose();
    for (let x = 0.5; x < t.w - 1; x++) {
        if (isMirrored(t, x)) {
            return Math.ceil(x) * 100;
        }
    }
    return Infinity;

    function isMirrored(map, mx) {
        let errors = 0;
        for (let x = 0; x < map.w; x++) {
            const ox = 2 * mx - x;
            if (ox >= 0 && ox < map.w) {
                for (let y = 0; y < map.h; y++) {
                    if (map[y][x] !== map[y][ox]) {
                        errors++;
                        if (errors > maxErrors) { return false; }
                    }
                }
            }
        }
        return errors >= minErrors && errors <= maxErrors;
    }
}

function part1(maps) {
    const result = maps.map(map => getReflectionValue(map, 0, 0));
    return result.sum();
}

function part2(maps) {
    const result = maps.map(map => getReflectionValue(map, 1, 2));
    return result.sum();
}

const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));