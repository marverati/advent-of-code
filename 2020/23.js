
const data0 = `389125467`;
const data1 = `614752839`;


function performMoves(s, moves, largeCircleSize) {
    let currentIndex = 0;
    const cups = new CupCircle(s, largeCircleSize);
    console.log('Initial: ', cups.toString());
    let nextLog = 2;
    for (let i = 1; i <= moves; i++) {
        currentIndex = performMove(cups, currentIndex);
        if (i === nextLog - 1 || moves < 100) {
            nextLog *= 2;
            console.log('Move', i + 1, ': ', cups.toString());
        }
    }
    return cups.toFinalString();
}

function performMove(cups, currentIndex) {
    const currentValue = cups.get(currentIndex);
    const pickedUp = cups.pickUp(currentIndex + 1, 3);
    const destinationIndex = cups.findIndex(currentValue - 1);
    // console.log(cups.toString(), " | ", currentValue, pickedUp.slice(), destinationIndex, "->", cups.get(destinationIndex));
    cups.placeAfter(pickedUp, destinationIndex);
    return cups.getNext(cups.getIndex(currentValue));
}

class CupCircle {
    constructor(line, largeCircleSize) {
        console.log(line);
        this.cups = line.split('').map(v => +v);
        this.min = this.cups.reduce((a, b) => Math.min(a, b), Infinity);
        this.max = this.cups.reduce((a, b) => Math.max(a, b), -Infinity);
        if (largeCircleSize > this.max) {
            for (let i = this.max + 1; i <= largeCircleSize; i++) {
                this.cups.push(i);
            }
        }
    }

    get(index) {
        return this.cups[index % this.cups.length];
    }

    getIndex(value) {
        return this.cups.findIndex(v => v === value) ?? -1;
    }

    getNext(index) {
        return (index + 1) % this.cups.length;
    }

    pickUp(startIndex, count = 1) {
        const result = [];
        for (let i = 0; i < count; i++) {
            const index = startIndex % this.cups.length;
            if (index < startIndex) { startIndex--; }
            result.push(this.cups[index]);
            this.cups.splice(index, 1);
        }
        return result;
    }

    placeAfter(cups, index) {
        if (index >= this.cups.length) {
            this.cups.push(... cups);
        } else {
            this.cups.splice(index + 1, 0, ... cups);
        }
    }

    findIndex(value) {
        // console.log("Testing ", value);
        while (this.getIndex(value) < 0) {
            value--;
            // console.log("Testing ", value);
            if (value < this.min) {
                value = this.max;
            }
        }
        // console.log("found!");
        return this.getIndex(value);
    }

    toString() {
        if (this.cups.length > 100) {
            return this.cups.slice(0, 5).join(',') + '...';
        }
        return this.cups.join('');
    }

    toFinalString() {
        if (this.cups.length > 100) {
            const nbs = this.getNeighbors(1, 2);
            return nbs.join(' * ') + " = " + nbs[0] * nbs[1];
        }
        let s = '';
        let i = this.getIndex(1);
        while (true) {
            i++;
            const v = this.get(i);
            if (v === 1) { break; }
            s += v;
        }
        return s;
    }

    getNeighbors(cup, count) {
        const result = [];
        const index = this.getIndex(cup) + 1;
        for (let i = 0; i < count; i++) {
            result.push(this.get(index + i));
        }
        return result;
    }

}

console.log(performMoves(data1, 1000, 1000000));