// This one is quite a mess!
// But it's also too much to clean up... now
// TODO for future me to never look at again :)

// const data = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`

// const data = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
// edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
// fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
// fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
// aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
// fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
// dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
// bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
// egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
// gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`

const data = require('./08data');

const digitsByNumber = [
  -1,
  2, // 1
  -1,
  -1,
  4, // 4
  -1,
  -1,
  3, // 7
  7, // 8
  -1
];

function handleInput2(data) {
  const lines = data.split('\n');
  let sum = 0;

  let lineIndex = 0;
  for (const line of lines) {
    lineIndex++;
    const [input, output] = line.split('|').map(v => v.trim());
    const inputDigits = input.split(' ');

    const mapping = getInputMapping(inputDigits);
    const outputDigits = output.split(' ');
  
    let out = '';
    for (const o of outputDigits) {
      const sorted = sortString(o);
      const digit = mapping[sorted];
      out += digit;
    }

    sum += (+out);
    console.log(lineIndex, ": ", +out);
  }

  return sum;
}

function getInputMapping(inputDigits) {
  // returns string -> 0..9 mapping with the 10 given inputDigits as keys
  // 1 4 7 8 are clear
  const chars = 'abcdefg'.split('');
  const keys = [
    '',
    inputDigits.find(inp => inp.length === 2),
    '',
    '',
    inputDigits.find(inp => inp.length === 4),
    '',
    '',
    inputDigits.find(inp => inp.length === 3),
    inputDigits.find(inp => inp.length === 7),
    ''
  ];
  // deduce a
  const aChar = getWithout(keys[7], keys[1]); // 7 is same as 1 but a is set additionally
  let bChar, cChar, dChar, eChar, fChar, gChar;
  // deduce c & f
  const [cf0, cf1] = keys[1].split('');
  const cf0Count = inputDigits.filter(inp => inp.includes(cf0) && !inp.includes(cf1)).length;
  if (cf0Count === 1) {
    cChar = cf0; fChar = cf1;
  } else {
    cChar = cf1; fChar = cf0;
  }
  // deduce b, e
  bChar = chars.find(char => inputDigits.filter(inp => inp.includes(char)).length === 6);
  eChar = chars.find(char => inputDigits.filter(inp => inp.includes(char)).length === 4);
  // deduce d, g
  dChar = chars.find(char => inputDigits.filter(inp => inp.includes(char)).length === 7 && keys[4].includes(char));
  gChar = getWithout('abcdefg', aChar + bChar + cChar + dChar + eChar + fChar);
  const inverseCharMap = {
    'a': aChar, 'b': bChar, 'c': cChar, 'd': dChar, 'e': eChar, 'f': fChar, 'g': gChar
  };
  const charMap = {};
  for (const char of chars) {
    charMap[inverseCharMap[char]] = char;
  }
  const mapping = {};
  for (const inp of inputDigits) {
    const sortedInp = sortString(inp);
    const corrected = inp.split('').map(c => charMap[c]).join('');
    const sortedOut = sortString(corrected);
    const number = {
      'abcefg': 0,
      'cf': 1,
      'acdeg': 2,
      'acdfg': 3,
      'bcdf': 4,
      'abdfg': 5,
      'abdefg': 6,
      'acf': 7,
      'abcdefg': 8,
      'abcdfg': 9
    }[sortedOut];
    mapping[sortedInp] = number;
  }
  return mapping;
}

function sortString(s) {
  return s.split('').sort().join('');
}

function getWithout(s1, s2) {
  let r = '';
  for (const c of s1) {
    if (!s2.includes(c)) {
      r += c;
    }
  }
  return r;
}

function handleInput(data) {
  const lines = data.split('\n');
  let count = 0;

  let lineIndex = 0;
  for (const line of lines) {
    lineIndex++;
    const [input, output] = line.split('|').map(v => v.trim());
    const inputDigits = input.split(' ');
    const outputDigits = output.split(' ');
  
    for (const o of outputDigits) {
      const digits = countDigits(o);
      console.log(digits);
      if (digitsByNumber.includes(digits)) {
        count++;
      }
    }

    console.log(lineIndex, ": ", count);
  }

  return count;
}

function countDigits(s) {
  const digits = new Set();
  let count = 0;
  for (const c of s) {
    if (!digits.has(c)) {
      digits.add(c);
      count++;
    }
  }
  return count;
}


console.log(handleInput2(data));