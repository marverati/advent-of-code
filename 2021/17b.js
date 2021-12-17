const trg0 = {x1:  20, y1:  -10, x2:  30, y2:  -5};
const trg1 = {x1: 230, y1: -107, x2: 283, y2: -57};

const t0 = performance.now();
const result = part2(trg1);
const t = performance.now() - t0;
console.log("Part 2: ", result, " in ", t);

function part2(trg) {
    const maxX = trg.x2, minY = trg.y1, maxY = 1000, maxStep = 1000;
    const allSteps = [];
    for (let vx = 1; vx <= maxX; vx++) {
        const range = meetsTargetVx(vx, trg.x1, trg.x2);
        if (range) {
            for (let i = range.from; i <= Math.min(range.to, maxStep); i++) {
                if (!allSteps[i]) { allSteps[i] = {x: 0, y: 0, xs: [], ys: []} }
                allSteps[i].x++;
                allSteps[i].xs.push(vx);
            }
        }
    }
    for (let vy = minY; vy <= maxY; vy++) {
        const range = meetsTargetVy(vy, trg.y1, trg.y2);
        if (range) {
            for (let i = range.from; i <= Math.min(range.to, maxStep); i++) {
                if (!allSteps[i]) { allSteps[i] = {x: 0, y: 0, xs: [], ys: []} }
                allSteps[i].y++;
                allSteps[i].ys.push(vy);
            }
        }
    }
    // Count combinations
    let count = 0;
    const combinations = new Set();
    for (const step of allSteps) {
        if (step) {
            for (const vx of step.xs) {
                for (const vy of step.ys) {
                    const key = 10000 * vx + vy;
                    if (!combinations.has(key)) {
                        combinations.add(key);
                        count++;
                    }
                }
            }
        }
    }
    return count;
}

function meetsTargetVx(vx, from, to) {
    // substitute a := vx + 0.5
    // x(s) = -0.5s² + a*s    up to parabola's vertex. s is step number
    // vertex is at x'(s) = 0 = -s + a <=> s = a = vx + 0.5, so highest x will always be after vx steps
    // so maxx = x(vx) = -0.5vx² + (vx + 0.5)vx = -0.5vx² + vx² + 0.5vx = 0.5vx² + 0.5vx
    const maxx = 0.5 * vx * (vx + 1);
    if (maxx < from) { return null; }
    // inversion s(x) = a +- sqrt(a² - 2x), where only the "-" case is relevant
    // so can compute range of steps s(from) and s(to)
    const a = vx + 0.5;
    const sFrom = a - Math.sqrt(a * a - 2 * from);
    if (maxx < to) {
        return { from: Math.ceil(sFrom), to: Infinity };
    }
    const sTo = a - Math.sqrt(a * a - 2 * to);
    if (Math.ceil(sFrom) <= Math.floor(sTo)) {
        return { from: Math.ceil(sFrom), to: Math.floor(sTo) };
    }
    return null;
}

function meetsTargetVy(vy, from, to) {
    // similar math to meetsTargetVx, but without limiting parabola to one half
    const a = vy + 0.5;
    const sFrom = a + Math.sqrt(a * a - 2 * to);
    const sTo = a + Math.sqrt(a * a - 2 * from);
    if (Math.ceil(sFrom) <= Math.floor(sTo)) {
        return { from: Math.ceil(sFrom), to: Math.floor(sTo) };
    }
    return null;
}