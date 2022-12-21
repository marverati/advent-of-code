require('./_helpers.js');
const { data1 } = require('./21data');
const Array2D = require('./dataStructures/Array2D.js');
const { deepCopy } = require('./_util.js');

const data0 = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

// tdwj: wfgq - tttc

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => {
            const parts = line.split(': ');
            const name = parts[0];
            const calc = parts[1].split(' ');
            let num = null, op = '', v1 = '', v2 = '';
            if (calc.length === 1) {
                num = +calc;
            } else {
                v1 = calc[0];
                op = calc[1];
                v2 = calc[2];
            }
            return {
                name,
                isNumber: num != null,
                num,
                op,
                v1,
                v2
            }
        });
    const monkeys = {};
    for (const m of lines) {
        monkeys[m.name] = m;
    }
    return monkeys;
}

function part1(monkeys) {
    return evaluateMonkey(monkeys, 'root');
}

function part2(monkeys) {
    const evaluate = (name) => evaluateMonkey(monkeys, name);

    const root = monkeys['root'];
    if (hasHuman(root.v1)) {
        return forceHumanValue(root.v1, evaluate(root.v2));
    } else {
        return forceHumanValue(root.v2, evaluate(root.v1));
    }

    function forceHumanValue(name, value) {
        if (name === 'humn') {
            return value;
        } else if (monkeys[name].num != null && monkeys[name].num !== value) {
            throw new Error('Cannot force value onto fixed value: ', name, value, monkeys[name].num);
        } else if (!monkeys[name].isNumber) {
            const humanIs1 = hasHuman(monkeys[name].v1);
            const human = humanIs1 ? monkeys[name].v1 : monkeys[name].v2;
            const other = humanIs1 ? monkeys[name].v2 : monkeys[name].v1;
            switch (monkeys[name].op) {
                case '+': // value = human + other
                    return forceHumanValue(human, value - evaluate(other));
                case '-': // value = human - other; or value = other - hum
                    return humanIs1 ? forceHumanValue(human, value + evaluate(other))
                        : forceHumanValue(human, evaluate(other) - value);
                case '*': // value = human * other <=> human = value / other;
                    return forceHumanValue(human, value / evaluate(other));
                case '/': // value = human / other; or value = other / hum;
                    return humanIs1 ? forceHumanValue(human, value * evaluate(other))
                        : forceHumanValue(human, evaluate(other) / value);
            }
        }
    }

    function hasHuman(name) {
        // Could be cached for optimization
        if (name === 'humn') { return true; }
        if (monkeys[name].isNumber) {
            return false;
        } else {
            return hasHuman(monkeys[name].v1) || hasHuman(monkeys[name].v2);
        }
    }
}

function evaluateMonkey(monkeys, name) {
    if (monkeys[name].num != null) {
        return monkeys[name].num;
    } else {
        const v1 = evaluateMonkey(monkeys, monkeys[name].v1);
        const v2 = evaluateMonkey(monkeys, monkeys[name].v2);
        let r = NaN;
        switch (monkeys[name].op) {
            case '+':
                r = v1 + v2;
                break;
            case '-':
                r = v1 - v2;
                break;
            case '*':
                r = v1 * v2;
                break;
            case '/':
                r = v1 / v2;
                break;
        }
        monkeys[name].num = r;
        return r;
    }
}

const data = prepareData(data1);
// (data.length < 50) && console.log(data);
console.log("Part 1: ", part1(deepCopy(data)));
console.log("Part 2: ", part2(data));