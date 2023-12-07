require('./_helpers.js');
const { data1 } = require('./07-data.js');
const { logTime, logProgress } = require('./_util.js');

const data0 = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => {
            const raw = line.split(' ')[0];
            const hand = raw.split('').map(c => order.indexOf(c));
            const result = {
                raw,
                hand,
                type: getType(hand),
                bid: +line.split(' ')[1]
            }
            return result;
        });
    return lines;
}

function getType(hand) {
    let jokers = 0;
    let rest = hand;
    if (jokersEnabled) {
        jokers = hand.filter(num => num === 0).length;
        rest = hand.filter(num => num !== 0);
    }
    const sorted = rest.slice().sort((a, b) => a - b);
    const counts = [];
    let num = -1;
    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] !== num) {
            num = sorted[i];
            counts.push(1);
        } else {
            counts.last++;
        }
    }
    counts.sort((a, b) => b - a);
    
    if (counts[0] + jokers === 5 || jokers === 5) {
        return 5; // five of a kind
    }
    if (counts[0] + jokers === 4) {
        return 4; // four of a kind
    }
    if (counts[0] + jokers === 3 && counts[1] === 2 || counts[0] === 3 && counts[1] + jokers === 2) {
        return 3.5; // full house
    }
    if (counts[0] + jokers === 3) {
        return 3; // three of a kind
    }
    if (counts[0] === 2 && counts[1] + jokers === 2) {
        return 2.2; // double pair
    }
    if (counts[0] + jokers === 2) {
        return 2; // pair
    }
    return 1; // high card
}

function compare(a, b) {
    // Compare type first
    if (a.type > b.type) {
        return 1;
    } else if (a.type < b.type) {
        return -1;
    } else {
        // Only if types are equal, compare card by card
        for (let i = 0; i < a.hand.length; i++) {
            if (a.hand[i] > b.hand[i]) {
                return 1;
            } else if (a.hand[i] < b.hand[i]) {
                return -1;
            }
        }
    }
    console.warn('hands have identical value');
    return 0;
}

function countHands(data) {
    data.sort((a, b) => compare(a, b));
    const result = data.map((v, i) => v.bid * (i + 1));
    return result.sum();
}

const data = data1;

// Part 1
let jokersEnabled = false;
let order = ["A", "K", "Q", "J", "T", 9, 8, 7, 6, 5, 4, 3, 2].map(v => "" + v).reverse();
logTime("Part 1: ", () => countHands(prepareData(data)));

// Part 2
jokersEnabled = true;
order = ["A", "K", "Q", "T", 9, 8, 7, 6, 5, 4, 3, 2, "J"].map(v => "" + v).reverse();
logTime("Part 2: ", () => countHands(prepareData(data)));