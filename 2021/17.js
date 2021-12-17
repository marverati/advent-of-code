class Probe {
    constructor(vx, vy) {
        this.x = 0;
        this.y = 0;
        this.vx = vx;
        this.vy = vy;
        this.highest = this.y;
    }

    proceed() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx -= Math.sign(this.vx);
        this.vy--;
        this.highest = Math.max(this.highest, this.y);
    }

    reaches(trg) {
        while (true) {
            // Target reached
            if (this.isWithin(trg)) {
                return true;
            }
            // Target unreachable?
            if (this.vx === 0) {
                if (this.x < trg.x1 || this.x > trg.x2) {
                    return false;
                }
            }
            // Passed it already
            if (this.y < trg.y1) {
                return false;
            }

            this.proceed();
        }
    }

    isWithin(trg) {
        return this.x >= trg.x1 && this.x <= trg.x2 && this.y >= trg.y1 && this.y <= trg.y2;
    }
}

function part1(trg) {
    const maxX = trg.x2, maxY = 200;
    let bestVY = 0, highest = 0;
    for (let vx = 0; vx <= maxX; vx++) {
        for (let vy = bestVY + 1; vy <= maxY; vy++) {
            const probe = new Probe(vx, vy);
            if (probe.reaches(trg)) {
                bestVY = vy;
                highest = probe.highest;
            }
        }
    }
    return highest;
}

function part2(trg) {
    const maxX = trg.x2, maxY = 300, minY = trg.y1;
    let count = 0;
    for (let vx = 0; vx <= maxX; vx++) {
        for (let vy = minY; vy <= maxY; vy++) {
            if (new Probe(vx, vy).reaches(trg)) {
                count++;
            }
        }
    }
    return count;
}

const trg0 = {x1:  20, y1:  -10, x2:  30, y2:  -5};
const trg1 = {x1: 230, y1: -107, x2: 283, y2: -57};
console.log("Part 1: ", part1(trg1));
console.log("Part 2: ", part2(trg1));