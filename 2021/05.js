// 11:12 - 11:39

const data0 = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`

const data1 = require('./05data');


function handleInput(input, includeDiagonal) {
    const lines = input.split("\n").map(l => l.trim());
    const allVents = lines.map(l => Vent.fromString(l));
    const vents = includeDiagonal ? allVents : allVents.filter(v => v.isHorV());
    const maxX = vents.reduce((v, vent) => Math.max(v, vent.x2), 0);
    const maxY = vents.reduce((v, vent) => Math.max(v, vent.y2), 0);
    console.log(allVents.length, vents.length, maxX, maxY);
    let overlaps = 0;
    for (let y = 0; y <= maxY; y++) {
        for (let x = 0; x <= maxX; x++) {
            const count = vents.filter(vent => vent.contains(x, y)).length;
            if (count >= 2) {
                overlaps++;
            }
        }
    }
    return overlaps;
}

class Vent {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.dx = this.x2 - this.x1;
        this.dy = this.y2 - this.y1;
    }

    contains(x, y) {
        if (this.isH()) {
            return within(x, this.x1, this.x2) && y === this.y1;
        } else if (this.isV()) {
            return within(y, this.y1, this.y2) && x === this.x1;
        } else {
            const dx = x - this.x1, dy = y - this.y1;
            if (Math.abs(dx) === Math.abs(dy)) {
                if ((dx * this.dx > 0) === (dy * this.dy > 0)) {
                    return within(dx, 0, this.dx);
                }
            }
        }
        return false;
    }

    isHorV() {
        return this.x1 === this.x2 || this.y1 === this.y2;
    }

    isH() {
        return this.y1 === this.y2;
    }

    isV() {
        return this.x1 === this.x2;
    }

    static fromString(s) {
        const pairs = s.split(' -> ');
        const coords1 = pairs[0].split(','), coords2 = pairs[1].split(',');
        return new Vent(+coords1[0], +coords1[1], +coords2[0], +coords2[1]);
    }
}

function within(v, a, b) {
    if (b > a) {
        return v >= a && v <= b;
    } else {
        return v >= b && v <= a;
    }
}

console.log(handleInput(data1, true));