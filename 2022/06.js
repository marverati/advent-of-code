require('./_helpers.js');

const { data1 } = require('./06data');

function findUniqueSequence(s, seqLength) {
    const allCharsUnique = (chars) => chars.length === chars.getCharSet().size;
    return s.find((i) => allCharsUnique(s.substr(i, seqLength))) + seqLength;
}

console.log("Part 1: ", findUniqueSequence(data1, 4));
console.log("Part 2: ", findUniqueSequence(data1, 14));