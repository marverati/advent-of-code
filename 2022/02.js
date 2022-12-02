require('./_helpers.js');
const { data1 } = require('./02data');
const { absMod } = require('./_util.js');

const data0 = `A Y
B X
C Z`;

function prepareData(data) {
    const lines = data
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "")
        // Map moves to 0 (rock), 1 (paper), 2 (scissors)
        .map(line => line.split(' ').map(char => "ABCXYZ".indexOf(char) % 3));
    return lines;
}

function part1(data) {
    let points = 0;
    for (const row of data) {
        // points based on own move
        points += row[1] + 1;
        // points based on game outcome
        if (row[0] === row[1]) {
            points += 3; // draw
        } else {
            // own move needs to be `opponentMove + 1` (modulo 3) (but JS' standard % can be negative)
            if (absMod(row[1] - row[0], 3) === 1) {
                points += 6; // won
            }
        }
    }
    return points;
}

function part2(data) {
    let points = 0;
    for (const row of data) {
        if (row[1] === 2) {
            // Won
            points += 6;
            row[1] = absMod(row[0] + 1, 3);
        } else if (row[1] === 1) {
            // Draw
            points += 3;
            row[1] = row[0];
        } else {
            // Lost
            row[1] = absMod(row[0] - 1, 3);
        }
        // points based on move
        points += (row[1] + 1);
    }
    return points;

}


const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));