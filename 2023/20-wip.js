require('./_helpers.js');
const { data0a, data1 } = require('./20-data.js');
const { logTime, logProgress, getLowestCommonMultiple } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0b = `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
`;

const data2 = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`

const data0 = data0a || data0b;

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => {
            const parts = line.split(" -> ")
            const type = parts[0][0];
            const name = parts[0].slice(1); // "roadcaster" is 1 name!
            const targets = parts[1].split(", ");
            return {
                type,
                name,
                targets,
                state: false, // onoff for % flip-flops, remembered high/low for & conjunction modules
                memory: {},
            };
        });
    return lines.toObject(v => v.name);
}

function part1(data) {
    data["output"] = { type: "_", name: "output", targets: [] };
    data["rx"] = { type: "!", name: "rx", targets: [] };
    const buttons = 100000000;
    let lowCount = 0, highCount = 0;
    const pulses = [];
    let rxLowPulses = 0;
    const observe = "zp";
    const observed = "nd jg fl nf sm cp kk bj rg".split(" ");
    let last = -1, lastO = -1, lastTrigger = -1;

    // Prepare memory sources
    for (const module of data.getValues()) {
        for (const trgS of module.targets) {
            const trg = data[trgS];
            if (trg && trg.type === '&') {
                trg.memory[module.name] = false;
            }
        }
    }

    let i = 0;
    for (i = 0; i < buttons; i++) {
        logProgress("", i, buttons);
        rxLowPulses = 0;
        trigger("roadcaster", false, "button");
        while (pulses.length > 0 && pulses.length < 100) {
            handlePulse(pulses.shift(), i);
        }
        if (rxLowPulses > 0) {
            console.log("Part 2: ", i);
        }
        if (data[observe].type === '&' && data[observe].memory.getValues().every(v => v)) {
            console.log(observe, "Is enabled during ", i, "with diff", i - last);
            last = i;
        }
        if (data[observe].type === '%' && data[observe].state) {
            if (i - last > 1) {
                console.log(observe, 'is high at', i, 'with diff', i - last);
            }
            last = i;
        }
        if (observed.every(o => data[o].state)) {
            console.log("All observed are high at", i, 'with diff', i - lastO, 'while', observe, 'is', data[observe].state);
            lastO = i;
        }
    }
    console.log(lowCount, highCount);
    return lowCount * highCount;

    function handlePulse(pulse, i) {
        const { high, target, source } = pulse;
        const module = data[target];
        if (!module) { return; }
        let sendHigh = false;
        const log = (i === -4094) ? console.log : () => {};
        log('handling', pulse.source, `-${pulse.high ? 'high' : 'low'}->`, pulse.target);
        switch (module.type) {
            case "%":
                if (!high) {
                    // console.log('  inverting ', module.name, ' from ', module.state, ' to ', !module.state);
                    module.state = !module.state;
                    sendHigh = module.state;
                } else {
                    return;
                }
                break;
            case "&":
                module.memory[source] = high;
                // console.log('Handling ', module, ' where memory is ', module.memory);
                sendHigh = !(Object.values(module.memory).every(v => v));
                break;
            case "_": // special handling of "output"
                return;
            case "!": // special handling of "rx"
                if (!high) {
                    rxLowPulses++;
                }
                break;
            default:
                sendHigh = high;
                break;
        }
        for (const t of module.targets) {
            trigger(t, sendHigh, target);
        }
    }

    function trigger(name, high, source) {
        if (source === observe && !high) {
            if (lastTrigger !== i) {
                console.log('Observed ', source, ' sending low pulse at ', i, 'to', name, 'with diff', i - lastTrigger);
                lastTrigger = i;
            }
        }
        if (high) {
            highCount++;
        } else {
            lowCount++;
        }
        pulses.push({
            source,
            high,
            target: name,
        });
        const out = pulses.last;
        // console.log(out.source, `-${out.high ? 'high' : 'low'}->`, out.target);
    }
}

function part2(data) {
    const steps = [
        [4, 4, 4, 20, 4, 4, 4, 4007],
        [2, 6, 2, 54, 2, 6, 2, 3947],
        [2, 2, 2, 26, 2, 2, 2, 4019],
        [2, 2, 2, 250, 2, 2, 2, 3571],
    ];
    const cycles = steps.map(series => series.reduce((a, b) => a + b, 0));
    let value = -1;
    const currentBase = [-1, -1, -1, -1];
    // Iterate based on first row, then check if compatible with other rows
    for (let i = 0; i < 1000000000; i++) {
        const step = steps[0][i % 8];
        value += step;
        // console.log(i, value);
        let fit = 0;
        for (let s = 1; s < steps.length; s++) {
            const nextBase = currentBase[s] + cycles[s];
            if (nextBase <= value) {
                currentBase[s] = nextBase;
            }
            const series = steps[s];
            let v = currentBase[s];
            if (v === value) { fit++; continue; }
            for (const off of series) {
                v += off;
                if (v === value) { fit++; break; }
            }
        }
        // 103413891544 too low
        if (fit >= 3) {
            console.log("Yes!!!", i, value);
            if (Math.random() < 0.01) { return value; }
            // return value;
        }
    }
    return -1;
}


const data = prepareData(data1);
console.log(getLowestCommonMultiple([4051, 4021, 4057, 3833]));
// (data.length < 50 || data instanceof Object) && console.log(data);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));