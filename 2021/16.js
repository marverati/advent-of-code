const { padStart } = require('./_util');
const { data1 } = require('./16data');

class Binary {
    constructor(s) {
        this.s = s;
        this.pos = 0;
        this.versionSum = 0;
        this.binTable = [];
        for (let i = 0; i < 16; i++) {
            this.binTable['' + i.toString(16).toUpperCase()] =
                padStart(i.toString(2), '0', 4).split('').map(v => +v);
        }
    }

    reset() {
        this.pos = 0;
    }

    getSumOfVersionsEncountered() {
        return this.versionSum;
    }

    getBit(i) {
        const index = Math.floor(i / 4);
        const c = this.s[index];
        const bin = this.binTable[c][i - 4 * index];
        return bin;
    }

    readNum(bits) {
        let result = 0;
        for (let i = 0; i < bits; i++) {
            result = 2 * result + this.getBit((this.pos++));
        }
        return result;
    }

    readPacket() {
        const version = this.readNum(3);
        this.versionSum += version;
        const tp = this.readNum(3);
        return this.readOperatorOrLiteral(tp);
    }

    readOperatorOrLiteral(tp) {
        if (tp === 4) { return this.readLiteral(); }
        const values = this.readOperatorValues();
        switch (tp) {
            case 0:
                return values.reduce((r, v) => r + v, 0);
            case 1:
                return values.reduce((r, v) => r * v, 1);
            case 2:
                return Math.min(...values);
            case 3:
                return Math.max(...values);
            case 5:
                return values[0] > values[1] ? 1 : 0;
            case 6:
                return values[0] < values[1] ? 1 : 0;
            case 7:
                return values[0] === values[1] ? 1 : 0;
            default:
                throw new Error("Invalid operator tp: " + tp);                
        }
    }

    readLiteral() {
        let readOn = true, result = 0;
        while (readOn) {
            readOn = this.readNum(1);
            result = 16 * result + this.readNum(4);
        }
        return result;
    }

    readOperatorValues() {
        const lenType = this.readNum(1), values = [];
        if (lenType === 1) {
            // 11 bits for num of packages
            const packageCount = this.readNum(11);
            for (let i = 0; i < packageCount; i++) {
                values.push(this.readPacket());
            }
        } else {
            // 15 bits for bit length
            const len = this.readNum(15);
            const target = this.pos + len;
            while (this.pos < target) {
                values.push(this.readPacket());
            }
        }
        return values;
    }
}

const bin = new Binary(data1);
const result = bin.readPacket();
console.log("Part 1: ", bin.getSumOfVersionsEncountered());
console.log("Part 2: ", result);