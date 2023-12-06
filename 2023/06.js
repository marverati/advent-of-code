require('./_helpers.js');
const { data0, data1 } = require('./06-data.js');
const { logTime, logProgress } = require('./_util.js');


function prepareData(data, ignoreWhitespace) {
    let lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split(/\s+/g).slice(1)) // split by whitespace and ignore first entry (caption)
    if (ignoreWhitespace) {
        lines = lines.map(line => [ line.join('') ]); // for part 2, we mush all the nums together to one big number
    }
    const result = {
        times: lines[0].map(v => +v),
        distances: lines[1].map(v => +v),
    }
    return result;
}

function part1(data) {
    const options = data.times.map((time, i) => {
        const record = data.distances[i];
        let count = 0;
        for (let j = 0; j < time; j++) {
            logProgress(null, j, time);
            const speed = j;
            const duration = time - j;
            const dis = duration * speed;
            if (dis > record) {
                count++;
            }
        }
        return count;
    })
    return options.product();
}

function part2(data) {
    return part1(data);
}

const data = data1;
logTime("Part 1: ", () => part1(prepareData(data, false)));
logTime("Part 2: ", () => part2(prepareData(data, true)));