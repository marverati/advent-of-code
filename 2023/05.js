require('./_helpers.js');
const { data0, data1 } = require('./05-data.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    // Seeds
    seeds = readSeeds(lines[0]);
    let currentMap;
    const maps = [];
    const result = {
        seeds,
        maps,
    };
    lines.shift();
    for (const line of lines) {
        if (line[0] == +line[0]) {
            // Numbers
            const nums = line.split(' ');
            currentMap.ranges.push({
                startSource: +nums[1],
                endSource: +nums[1] + +nums[2],
                startTarget: +nums[0],
                endTarget: +nums[0] + +nums[2],
                length: +nums[2],
                diff: +nums[0] - +nums[1],
            });
        } else {
            // Start of new map
            const name = line.split(' ')[0];
            const parts = name.split('-');
            currentMap = {
                from: parts[0],
                to: parts[2],
                ranges: [],
            };
            maps.push(currentMap);
        }
    }
    return result;

    function readSeeds(line) {
        return line.split(' ').slice(1).map(v => +v);
    }
}

function part1(data) {
    const seedLocations = data.seeds.map(seed => {
        let current = seed;
        // assuming sorted order
        for (const map of data.maps) {
            // find right range
            for (const range of map.ranges) {
                if (current >= range.startSource && current < range.endSource) {
                    current = range.startTarget + current - range.startSource;
                    break;
                }
            }
        }
        return current;
    });
    return Math.min(...seedLocations);
}

function part2(data) {
    const seedLocations = [];
    for (let i = 0; i < data.seeds.length; i += 2) {
        const seedStart = data.seeds[i];
        const seedCount = data.seeds[i + 1];
        const seedEnd = seedStart + seedCount;
        const ranges = [{from: seedStart, to: seedEnd}]; // initially one undivided range
        // assuming sorted order of mapping steps
        for (const map of data.maps) {
            // find ranges that cut current ranges
            const newRanges = [];
            for (const rangeMaps of map.ranges) {
                for (let r = 0; r < ranges.length; r++) {
                    const range = ranges[r];
                    const outside = rangeMaps.startSource >= range.to || rangeMaps.endSource <= range.from;
                    if (!outside) {
                        // Range applies
                        if (rangeMaps.startSource > range.from && rangeMaps.endSource < range.to) {
                            // split into three parts; inner, mapped range, left and right
                            newRanges.push({from: rangeMaps.startSource + rangeMaps.diff, to: rangeMaps.endSource + rangeMaps.diff})
                            ranges.push({from: rangeMaps.endSource, to: range.to});
                            range.to = rangeMaps.startSource;
                        } else if (rangeMaps.startSource > range.from) {
                            // split into two parts on startSource
                            newRanges.push({from: rangeMaps.startSource + rangeMaps.diff, to: range.to + rangeMaps.diff})
                            range.to = rangeMaps.startSource;
                        } else if (rangeMaps.endSource < range.to) {
                            // split into two parts on endSource
                            newRanges.push({from: range.from + rangeMaps.diff, to: rangeMaps.endSource + rangeMaps.diff})
                            range.from = rangeMaps.endSource;
                        } else {
                            // split into one part
                            newRanges.push({from: range.from + rangeMaps.diff, to: range.to + rangeMaps.diff});
                            ranges.splice(r, 1);
                            r--;
                        }
                    }
                }
            }
            ranges.push(...newRanges);
        }
        seedLocations.push(Math.min(...ranges.map(range => range.from)));
    }
    return Math.min(...seedLocations);
}


const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));