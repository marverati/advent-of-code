require('./_helpers.js');
const { data0, data1 } = require('./04data.js');

function prepareData(data) {
    const cards = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => {
            const content = line.split(': ')[1];
            const lists = content.split(' | ');
            const result = {
                winning: lists[0].split(' ').filter(s => s != '').map(s => +s),
                own: lists[1].split(' ').filter(s => s != '').map(s => +s),
                correct: -1, // calculated below
            };
            result.correct = result.own.filter(num => result.winning.includes(num)).length;
            return result;
        });
    return cards;
}

function part1(cards) {
    const points = cards.map(card =>
        (card.correct > 0) ? 2 ** (card.correct - 1) : 0);
    return points.sum();
}

function part2(cards) {
    const copies = cards.map(line => 1);
    for (let i = 0; i < cards.length; i++) {
        for (let j = 1; j <= cards[i].correct; j++) {
            copies[i + j] += copies[i];
        }
    }
    return copies.sum();
}

const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));