// 6:00 - 6:22 - 6:28

const data0 = `[({(<(())[]>[[{[]{<()<>>
  [(()[<>])]({[<{<<[]>>(
  {([(<{}[<>[]}>{[]{[(<()>
  (((({<>}<{<{<>}{[]{[]{}
  [[<[([]))<([[{}[[()]]]
  [{[{({}]{}}([{[{{{}}([]
  {<[[]]>}<{[{[{[]{()[[[]
  [<(<(<(<{}))><([]([]()
  <{([([[(<>()){}]>(<<{{
  <{([{{}}[<[[[<>{}]]]>[]]`;



const { data1 } = require('./10data');

const opening = "([{<";
const closing = ")]}>";
const points = [3, 57, 1197, 25137];
let remainingStack = [];

function prepareData(data) {
  return data.split("\n").map(line => line.trim());
}

function part1(data) {
  const corrupted = data.filter(line => isCorrupted(line));
  let sum = 0;
  for (const line of corrupted) {
    const i = findIllegalChar(line);
    const tp = closing.indexOf(line[i]);
    const p = points[tp];
    sum += p;
  }
  return sum;
}

function isCorrupted(line) {
  return findIllegalChar(line) >= 0;
}

// Will return index >= 0 for corrupted line if a chunk closes incorrectly.
// Will return stack of expected closing bracket types (reversed) otherwise.
function findIllegalChar(line) {
  const depth = [0, 0, 0, 0];
  const typeStack = [];
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    const op = opening.indexOf(c);
    if (op >= 0) {
      depth[op]++;
      typeStack.push(op);
    } else {
      const cl = closing.indexOf(c);
      // Wrong bracket closed?
      const top = typeStack.length > 0 && typeStack.pop();
      if (top !== cl) {
        return i;
      }
      // Reached negative depth?
      depth[cl]--;
      if (depth[cl] < 0) {
        return i;
      }
    }
  }
  return typeStack;
}

function part2(data) {
  const incomplete = data.filter(line => !isCorrupted(line));
  let scores = [];
  for (const line of incomplete) {
    const remainingStack = findIllegalChar(line);
    if (remainingStack instanceof Array) {
      // remaininStack tells us what needs to come after
      let score = 0;
      for (let i = remainingStack.length - 1; i >= 0; i--) {
        const charScore = 1 + remainingStack[i];
        score = 5 * score + charScore;
      }
      scores.push(score);
    }
  }
  // Take median
  scores.sort((a, b) => a - b);
  return scores[(scores.length - 1) / 2];
}


const data = prepareData(data1);
console.log(part1(data));
console.log(part2(data));