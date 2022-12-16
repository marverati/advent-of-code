require('./_helpers.js');
const { data0, data1 } = require('./16data');
const Array2D = require('./dataStructures/Array2D.js');

// Valve FF has flow rate=0; tunnels lead to valves EE, GG

function prepareData(data) {
    const map = {};
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => {
            const els = line.split(' ');
            const name = els[1];
            const flow = parseInt(els[4].split('=')[1]);
            const p = Math.max(line.indexOf(' valve '), line.indexOf(' valves '));
            const targets = line.substr(p + 7).trim().split(', ');
            // targets.push(name); // staying in a spot is possible
            map[name] = { name, flow, targets };
            return map[name];
        });
    return map;
}

function part1(map) {
    let totalFlow = 0;
    let cell = 'AA';
    const storage = {};

    const best = findBestFlow(map, cell, 30, storage, []);

    // const keys = Object.keys(storage).sort((a, b) => (+b.substr(2)) - (+a.substr(2)));
    // console.log(keys.map(key => key + ': ' + storage[key]));

    return best;
}

function findBestFlow(map, cell, timeRemaining, storage, openValves) {
    const key = cell + timeRemaining + '_' + openValves.join(',') // note: maybe problems here with running multiple times through same valve???
    if (storage[key] != null) {
        return storage[key];
    }
    if (timeRemaining <= 0) {
        return 0;
    }
    timeRemaining--; // move to next tunnel
    // Own valve or not?
    let result = 0;
    if (map[cell].flow > 0 && openValves.indexOf(cell) < 0) {
        // Compare
        const newValves = openValves.slice();
        newValves.push(cell);
        const bestWith = map[cell].flow * timeRemaining + map[cell].targets.map(t => findBestFlow(map, t, timeRemaining - 1, storage, newValves)).max();
        const bestWithout = map[cell].targets.map(t => findBestFlow(map, t, timeRemaining, storage, openValves)).max();
        result = Math.max(bestWith, bestWithout);
        // console.log(key, bestWith, bestWithout);
    } else {
        // Own valve is useless
        result = map[cell].targets.map(t => findBestFlow(map, t,  timeRemaining, storage, openValves)).max();
    }
    storage[key] = result;
    return result;
}

function part2(map) {
    const storage = {};

    const best = findBestFlow2(map, 'AA', 'AA', '', '', 26, storage, {});

    // const keys = Object.keys(storage).sort((a, b) => parseInt(b.substr(6)) - parseInt(a.substr(6)));
    // console.log(keys.map(key => key + ': ' + storage[key]));
    
    return best
}

let highestTimeLogged = 0;
const timesSolved = {};

const cellDistances = {};
// Calculate all distances
function calcDistances(map) {
    const cells = Object.keys(map);
    // Dis to self
    for (const cell of cells) {
        const key = cell + "-" + cell;
        cellDistances[key] = 0;
    }
    // Stepwise grow the network
    for (const step of cells) {
        for (const cell of cells) {
            for (const other of cells) {
                if (getDistance(map, cell, other) == null) {
                    const key1 = cell + "-" + other;
                    const key2 = other + "-" + cell;
                    const bestNb = map[cell].targets.map(t => getDistance(map, t, other)).filter(v => v != null).min();
                    if (bestNb < Infinity) {
                        cellDistances[key1] = bestNb + 1;
                        cellDistances[key2] = bestNb + 1;
                    }
                }
            }
        }
    }
}

function getDistance(map, cell1, cell2) {
    if (cell1 === cell2) { return 0; }
    if (map[cell1].targets.includes(cell2)) { return 1; }
    // if (cell2 < cell1) { const tmp = cell2; cell2 = cell1; cell1 = tmp; }
    const key = cell1 + "-" + cell2;
    if (cellDistances[key] != null) {
        return cellDistances[key];
    }
    return null;
}

function findBestFlow2(map, cell, elCell, prevCell, prevElCell, timeRemaining, storage, openValves) {
    const cells = [cell, elCell].sort((a, b) => a > b ? 1 : -1);
    const keysInReach = Object.keys(openValves).filter(key => getDistance(map, cell, key) < timeRemaining || getDistance(map, elCell, key) < timeRemaining);
    
    // If even with more time remaining we didn't find any value, then skip this
    // for (let t = timeRemaining + 1; t <= highestTimeLogged; t++) {
    //     const key = cells[0] + ',' + cells[1] + ':' + timeRemaining + '_' + Object.keys(openValves).sort().join(',') // note: maybe problems here with running multiple times through same valve???
    //     if (storage[key] === 0) { return 0; }
    // }
    
    const key = cells[0] + ',' + cells[1] + ':' + timeRemaining + '_' + keysInReach.sort().join(',') // note: maybe problems here with running multiple times through same valve???
    if (storage[key] != null) {
        return storage[key];
    }
    if (timeRemaining <= 1) {
        return 0;
    }

    timeRemaining--;
    let result = 0;

    // both move
    for (const t1 of map[cell].targets) {
        if (t1 === prevCell) { continue; }
        for (const t2 of map[elCell].targets) {
            if (t2 === prevElCell) { continue; }
            result = Math.max(result,
                findBestFlow2(map,   t1, t2,   cell, elCell,   timeRemaining, storage, openValves));
        }
    }
    // player turns valve, el moves
    if (!openValves[cell] && map[cell].flow > 0) {
        const newValves = { ... openValves, [cell]: true }
        for (const t2 of map[elCell].targets) {
            if (t2 === prevElCell) { continue; }
            result = Math.max(result, (timeRemaining * map[cell].flow
                + findBestFlow2(map,   cell, t2,   '', elCell,   timeRemaining, storage, newValves) ));
        }
    }
    if (!openValves[elCell] && map[elCell].flow > 0) {
        // player moves, el turns valve
        const newValves = { ... openValves, [elCell]: true }
        for (const t1 of map[cell].targets) {
            if (t1 === prevCell) { continue; }
            result = Math.max(result, (timeRemaining * map[elCell].flow
                + findBestFlow2(map,   t1, elCell,   cell, '',   timeRemaining, storage, newValves) ));
        }
        if (!openValves[cell] && cell !== elCell && map[cell].flow > 0) {
            // both turn valves
            const newValves = { ... openValves, [cell]: true, [elCell]: true }
            result = Math.max(result, (timeRemaining * (map[cell].flow + map[elCell].flow)
                + findBestFlow2(map,   cell, elCell,   '', '',   timeRemaining, storage, newValves) ));
        }
    }

    if (!timesSolved[timeRemaining]) {
        highestTimeLogged = Math.max(highestTimeLogged, timeRemaining);
        timesSolved[timeRemaining] = true;
        console.log('First of level ', timeRemaining, ' solved as ', result, 'from', cell, elCell, prevCell, prevElCell);
    }
    storage[key] = result;
    return result;
}


const data = prepareData(data0);
calcDistances(data);
// console.log(data);
// console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));