const { centerString } = require("../_util");
const Array2D = require("./Array2D");


class HexMap {
    constructor(w, h, valueOrGenerator, secondRowLongerLeft = false, secondRowLongerRight = true) {
        const valueGen = valueOrGenerator instanceof Function ? valueOrGenerator : () => valueOrGenerator;
        this.secondRowLongerLeft = secondRowLongerLeft;
        this.secondRowLongerRight = secondRowLongerRight;
        this.w = w;
        this.h = h;
        const generator = (x, y) => {
            return {
                x,
                y,
                neighbors: [],
                value: valueGen(x, y),
                cx: x, // values for coordinate updated in loop below
                cy: y
            };
        }
        const w0 = w;
        const w1 = w - 1 + (secondRowLongerLeft ? 1 : 0) + (secondRowLongerRight ? 1 : 0);
        this.w0 = w0;
        this.w1 = w1;
        const map = this.array = new Array2D((y) => y % 2 === 0 ? w0 : w1, h, generator);
        this.cellCount = map.cellCount;
        // Setup neighbors
        this.array.forEachCell((obj, x, y) => {
            // Connect left and right
            tryAddNeighbor(x - 1, y);
            tryAddNeighbor(x + 1, y);
            const isAlternating = (y % 2) === 1;
            const isIndented = (isAlternating !== secondRowLongerLeft);
            obj.cx = isAlternating ? (x + (isIndented ? 0.5 : -0.5)) : x;
            const x0 = isIndented ? x : x - 1;
            // Top
            if (y > 0) {
                tryAddNeighbor(x0, y - 1);
                tryAddNeighbor(x0 + 1, y - 1);
            }
            // Bottom
            if (y < map.h - 1) {
                tryAddNeighbor(x0, y + 1);
                tryAddNeighbor(x0 + 1, y + 1);
            }

            function tryAddNeighbor(x, y) {
                const nb = map.get(x,y);
                nb && obj.neighbors.push(nb);
            }
        });
    }

    forEachCell(handler) {
        return this.array.forEachCell(handler);
    }

    forEachRow(handler) {
        return this.array.forEachRow(handler);
    }

    getCell(x, y) {
        return this.array.get(x, y);
    }

    getValue(x, y) {
        return this.array.get(x, y).value;
    }

    setValue(x, y, v) {
        return this.array.get(x, y).value = v;
    }

    isInside(x, y) {
        return this.array.isInside(x, y);
    }

    forAllNeighbors(x, y, handler) {
        const cell = this.array.get(x, y);
        cell.neighbors.forEach((nb) => handler(nb, nb.x, nb.y));
    }

    getNeighborCells(x, y) {
        return this.getCell(x, y).neighbors;
    }

    getNeighborValues(x, y) {
        return this.getCell(x, y).neighbors.map(nb => nb.value);
    }

    toString (valueToString = (v) => v, halfCellSize = 2) {
        const indent = ' '.repeat(halfCellSize);
        const indent0 = this.secondRowLongerLeft ? indent : '';
        const indent1 = this.secondRowLongerLeft ? '' : indent;
        const fullCellSize = 2 * halfCellSize;
        let s = '';
        this.array.forEachRow((row, y) => {
            const indent = (y % 2 === 0) ? indent0 : indent1;
            s += indent;
            for (let x = 0; x < row.length; x++) {
                const cs = valueToString(this.getValue(x, y));
                s += centerString(cs, fullCellSize);
            }
            if (y < this.array.h - 1) {
                s += '\n';
            }
        });
        return s;
    }

    slice() {
        return this.secondRowLongerLeft();
    }

    clone() {
        return new HexMap(this.w, this.h, (x, y) => this.getValue(x, y), this.secondRowLongerLeft, this.secondRowLongerRight);
    }

    processCells(handler) {
        this.forEachCell((cell, x, y) => {
            cell.value = handler(cell, x, y);
        });
    }

    map(mapFunc) {
        return new HexMap(this.w, this.h, (x, y) => mapFunc(this.getValue(x, y), x, y), this.secondRowLongerLeft, this.secondRowLongerRight);
    }

    countCells(testFunc) {
        return this.array.countCells(testFunc);
    }

    countValues(testFunc) {
        return this.reduceValues((current, v) => current + (testFunc(v) ? 1 : 0), 0);
    }

    reduceCells(reducer, initial) {
        return this.array.reduceCells(reducer, initial);
    }

    reduceValues(reducer, initial) {
        let current = initial;
        this.forEachCell((cell) => {
            current = reducer(current, cell.value);
        });
        return current;
    }

    combine(other, combiner) {
        return new HexMap(
            this.w,
            this.h,
            (x, y) => combiner(this.getValue(x, y), other.getValue(x, y), x, y),
            this.secondRowLongerLeft,
            this.secondRowLongerRight
        );
    }

    combineWith(other, combiner) {
        this.array.combineWith(other, combiner);
    }
}

module.exports = HexMap;