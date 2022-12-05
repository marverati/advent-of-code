require('./_helpers.js');
const { data1 } = require('./05data');
const { deepCopy } = require('./_util.js');

const data0 = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .filter(line => line !== "") // remove empty lines
    const result = {
        state: [],
        moves: []
    };
    // Setup of initial stacks; lines may look like: [R] [R] [P] [F] [V]     [D]     [L]
    let i = 0;
    for (i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim()[0] !== '[') { break; } // stack setup over
        for (let c = 0; c < line.length; c += 4) {
            const columnIndex = Math.floor(c / 4);
            const type = line[c + 1];
            if (type && type !== ' ') {
                if (!result.state[columnIndex]) { result.state[columnIndex] = []; }
                result.state[columnIndex].unshift(type);
            }
        }
    }
    // List of moves; lines may look like: move 4 from 5 to 9
    for (i = i; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('move ')) {
            const parts = line.split(' ');
            const count = +parts[1];
            const from = +parts[3] - 1;
            const to = +parts[5] - 1;
            result.moves.push({
                count,
                from,
                to
            });
        }
    }
    return result;
}

function part1(data) {
    return performMoves(data, 1);
}

function part2(data) {
    return performMoves(data, 2);
}

function performMoves(data, part = 1) {
    for (const move of data.moves) {
        performMove(data.state, move, part === 2);
    }
    return data.state.map(col => col.last).join(''); // top of stacks
}

function performMove(state, move, allAtOnce = false) {
    // One at a time
    if (!allAtOnce) {
        for (let i = 0; i < move.count; i++) {
            const el = state[move.from].pop();
            state[move.to].push(el);
        }
    } else {
        // All at once
        const els = state[move.from].splice(-move.count);
        state[move.to].push(... els);
    }
}


const data = prepareData(data1);
console.log("Part 1: ", part1(deepCopy(data)));
console.log("Part 2: ", part2(data));