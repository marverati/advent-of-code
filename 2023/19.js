require('./_helpers.js');
const { data1 } = require('./19-data.js');
const { logTime, logProgress } = require('./_util.js');

const data0 = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`

function prepareData(data) {
    const lines = data.trim()
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
    const workflows = {};
    const parts = [];
    let i = 0;
    // Workflows
    for (; i < lines.length; i++) {
        if (lines[i].trim() === '') { break; } // empty line found -> jump over to parts section
        const [name, sRules] = lines[i].split("{");
        const rules = sRules.intrude(0, 1).split(",").map(sRule => {
            const pLT = sRule.indexOf("<");
            const pGT = sRule.indexOf(">");
            const pC = sRule.indexOf(":");
            if (pLT >= 0 || pGT >= 0) {
                const p = Math.max(pLT, pGT);
                return {
                    attr: sRule.substring(0, p),
                    op: sRule[p],
                    value: +sRule.substring(p + 1, pC),
                    nextWorkflow: sRule.substring(pC + 1),
                }
            } else {
                return sRule;
            }
        });
        workflows[name] = {
            name,
            rules,
        };
    }
    // Parts
    for (i++; i < lines.length; i++) {
        const content = lines[i].intrude(1);
        const part = {};
        let total = 0;
        content.split(",").forEach(s => {
            const p = s.indexOf("=");
            const name = s.substring(0, p);
            part[name] = +s.substring(p + 1);
            total += part[name];
        });
        part.total = total;
        parts.push(part);
    }
    return {
        workflows,
        parts,
    };
}

function part1(data) {
    const accepted = data.parts.filter(part => processPart(data, part) === 'A');
    const values = accepted.map(part => part.total);
    return values.sum();
}

function processPart(data, part) {
    let wf = "in";
    while (true) {
        const workflow = data.workflows[wf];
        for (const rule of workflow.rules) {
            // End rule
            if (rule === "R" || rule === "A") {
                return rule;
            } else if (typeof rule === 'string') {
                wf = rule;
                continue;
            }
            // Formula rule
            const v = part[rule.attr];
            const ref = rule.value;
            const ruleMet = (rule.op === '>' && v > ref) || (rule.op === '<' && v < ref);
            if (ruleMet) {
                wf = rule.nextWorkflow;
                // End rule
                if (wf === 'R' || wf === 'A') {
                    return wf;
                }
                // Ignore remaining rules of this workflow and proceed with next workflow
                break;
            }
        }
    }
}

function part2(data) {
    const { workflows } = data;
    const total = countAccepted("in", {x: {min: 1, max: 4000}, m: {min: 1, max: 4000}, a: {min: 1, max: 4000}, s: {min: 1, max: 4000}});
    return total;

    function countAccepted(wf, bounds) {
        if (wf === 'A') {
            return getBoundsCombinations(bounds);
        } else if (wf === 'R') {
            return 0;
        }
        let count = 0;
        for (const rule of workflows[wf].rules) {
            if (rule === 'A') {
                return count + getBoundsCombinations(bounds);
            } else if (rule === 'R') {
                return count;
            } else if (typeof rule === 'string') {
                return count + countAccepted(rule, bounds);
            } else {
                // Conditional rule -> recursive application of rule, plus continuation of next rule with updated bounds
                const { attr, op, value, nextWorkflow } = rule;
                const splitAt = (op === '<') ? value - 0.5 : value + 0.5;
                const inside = splitAt >= bounds[attr].min && splitAt <= bounds[attr].max;
                if (inside) {
                    const newBounds = cloneBounds(bounds);
                    if (op === '<') {
                        newBounds[attr].max = value - 1;
                        bounds[attr].min = value;
                    } else {
                        newBounds[attr].min = value + 1;
                        bounds[attr].max = value;
                    }
                    count += countAccepted(nextWorkflow, newBounds);
                }
            }
        }
        // Should never reach this point
        throw new Error("Leaky rule detected");
    }

    function getBoundsCombinations(bounds) {
        const keys = Object.keys(bounds);
        const ranges = keys.map(key => bounds[key].max - bounds[key].min + 1);
        const result = ranges.product();
        return result;
    }

    function cloneBounds(bounds) {
        const other = {};
        for (const a of Object.keys(bounds)) {
            other[a] = { ... bounds[a] };
        }
        return other;
    }
}

const data = prepareData(data1);
logTime("Part 1: ", () => part1(data));
logTime("Part 2: ", () => part2(data));