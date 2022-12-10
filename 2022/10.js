require('./_helpers.js');
const {  data0, data1 } = require('./10data');
const Array2D = require('./dataStructures/Array2D.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split(" "))
    lines.forEach(line => { line[1] != null && (line[1] = +line[1]) }) // turn numbers into numbers
    return lines;
}

const cycleCount = {
    "noop": 1,
    "addx": 2,
}

function bothParts(data) {
    let part1 = 0,  part2 = [""];
    let cycle = 0, crtX = 0, x = 1;
    let cmd = data.shift();
    let cmdCycles = cycleCount[cmd[0]];
    while (true) {
        // New CRT line (part 2)
        if (cycle % 40 === 0) {
            part2.push("");
            crtX = 0;
        }
        cycle++;
        cmdCycles--;
        // Count signal strength (part 1)
        if (cycle >= 10 && (cycle - 20) % 40 === 0) {
            part1 += cycle * x;
        }
        // Render "pixel" (part 2)
        if (Math.abs(crtX - x) <= 1) {
            part2.last += "#";
        } else {
            part2.last += ".";
        }
        crtX++;
        // execute command
        if (cmdCycles <= 0) {
            switch (cmd[0]) {
                case "addx":
                    x += cmd[1];
                    break;
            }
            // next command
            cmd = data.shift();
            if (!cmd) { break; }
            cmdCycles = cycleCount[cmd[0]];
        }
    }

    return {
        part1,
        part2: "\n" + part2.join("\n")
    };
}

const data = prepareData(data1);
(data.length < 50) && console.log(data);
const result = bothParts(data);
console.log("Part 1: ", result.part1);
console.log("Part 2: ", result.part2);