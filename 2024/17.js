require('./_helpers.js');
const { data1 } = require('./17-data.js');
const { assertEqual, logTime, absMod, trunc } = require('./_util.js');

const sample1 = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`

const sample2 = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`

function prepareData(data) {
    const blocks = data.split('\n\n');
    const register = blocks[0].split('\n').filter(line => line != '').map(line => +line.split(': ')[1]);
    const program = blocks[1].split(': ')[1].split(',').map(v => +v);
    return { register, program };
}

function part1({register, program}, expectedOut = "") {
    let pointer = 0;
    let result = '';
    expectedOut = "," + expectedOut;
    while (pointer < program.length) {
        const op = program[pointer++];
        const param = program[pointer++];
        switch (op) {
            case 0: // adv
                const num = register[0];
                const den = 2 ** combo(param);
                register[0] = trunc(num / den);
                break;
            case 1: // bxl
                register[1] = register[1] ^ param;
                break;
            case 2: // bst
                register[1] = absMod(combo(param), 8);
                break;
            case 3: // jnz
                if (register[0] !== 0) {
                    pointer = param;
                }
                break;
            case 4: // bxc
                register[1] = register[1] ^ register[2];
                break;
            case 5: // out
                result = result + "," + absMod(combo(param), 8);
                // Check exit condition
                if (result === expectedOut) {
                    return true;
                } else if (expectedOut !== ',' && !expectedOut.startsWith(result)) {
                    return false;
                }
                break;
            case 6: // bdv
                const num2 = register[0];
                const den2 = 2 ** combo(param);
                register[1] = trunc(num2 / den2);
                break;
            case 7: // cdv
                const num3 = register[0];
                const den3 = 2 ** combo(param);
                register[2] = trunc(num3 / den3);
                break;
        }
    }
    return result.slice(1);

    function combo(v) {
        if (v <= 3) { return v; }
        if (v <= 6) { return register[v - 4]; }
        throw new Error("Invalid combo operator: " + v);
    }
}

function part2(data) {
    const [A,B,C] = data.register;
    const program = data.program;
    const progString = program.join(',');
    let from = 0;
    for (let i = program.length - 1; i >= 0; i--) {
        const lookingFor = program[i];
        let j = 0;
        do {
            j++;
            const result = part1({register: [from, 0, 0], program});
            if (result.startsWith(lookingFor) && progString.endsWith(result)) {
                from *= 8;
                break;
            }
        } while (from++ > -1);
    }
    return from / 8;
}

const sampleData = () => prepareData(sample1);
const userData = () => prepareData(data1);
assertEqual("Part 1 works with example", part1(sampleData()), '4,6,3,5,6,3,5,2,1,0');

logTime("Part 1: ", () => part1(userData(), ""));
logTime("Part 2: ", () => part2(userData()));