require('./_helpers.js');
const { data0, data1 } = require('./02-data.js');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(lineToGame)
    return lines;
}

function lineToGame(line) {
    const parts = line.split(': ');
    const id = +parts[0].split(' ')[1];
    const subGames = parts[1].split('; ');
    const reveals = subGames.map(reveal => {
        const parts = reveal.split(', ')
        const result = maxColors.mapValues(v => 0);
        for (const part of parts) {
            const [num, color] = part.split(' ');
            result[color] = +num;
        }
        return result;
    })
    return {
        id,
        reveals,
    };
}

const maxColors = {
    red: 12,
    green: 13,
    blue: 14,
}
const colors = Object.keys(maxColors);

function part1(data) {
    const possible = data.filter(game =>
        game.reveals.every(reveal =>
            colors.every(color =>
                reveal[color] <= maxColors[color])));
    const sum = possible.map(game => game.id).sum();
    return sum;
}

function part2(data) {
    const powers = data.map(game => {
        let mins = { red: 0, green: 0, blue: 0 }
        game.reveals.forEach(reveal => {
            colors.forEach(color => {
                mins[color] = Math.max(mins[color], reveal[color]);
            });
        });
        return mins.red * mins.blue * mins.green;
    })
    return powers.sum();
}

const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));