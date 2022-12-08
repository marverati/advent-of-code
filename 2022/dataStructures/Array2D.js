
class Array2D extends Array {
    constructor(wOrFunction, h, valueOrGenerator) {
        super(h);
        const generator = valueOrGenerator instanceof Function ? valueOrGenerator : () => valueOrGenerator;
        let cellCount = 0;
        for (let y = 0; y < h; y++) {
            const row = this[y] = [];
            const w = wOrFunction instanceof Function ? wOrFunction(y) : wOrFunction;
            for (let x = 0; x < w; x++) {
                row[x] = generator(x, y);
                cellCount++;
            }
        }
        this.cellCount = cellCount;
        this.h = h;
        this.w = this[0].length;
        this.directNeighborOffsets = [ [0, -1], [1, 0], [0, 1], [-1, 0] ];
        this.allNeighborOffsets = [ [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1] ];
    }

    forEachCell(handler) {
        for (let y = 0; y < this.h; y++) {
            const row = this[y], l = row.length;
            for (let x = 0; x < l; x++) {
                handler(row[x], x, y);
            }
        }
    }

    forEachRow(handler) {
        for (let y = 0; y < this.h; y++) {
            handler(this[y], y);
        }
    }

    processCells(mapFunc, buffered = false) {
        this.forEachCell((cell, x, y) => {
            this[y][x] = mapFunc(cell, x, y);
        });
    }

    map(mapFunc) {
        return new Array2D((y) => this[y].length, this.h, (x, y) => mapFunc(this[y][x], x, y));
    }

    isInside(x, y) {
        return x === (x << 0) && y === (y << 0) && x >= 0 && y >= 0 && y < this.h && x < this[y].length;
    }

    get(x, y, defaultValue = null) {
        return this.isInside(x, y) ? this[y][x] : defaultValue;
    }

    set(x, y, v) {
        if (this.isInside(x, y)) {
            this[y][x] = v;
        } else {
            throw new Error("Setting illegal map position: " + x + "," + y);
        }
    }

    forNeighborOffsets(x, y, offsets, handler) {
        for (const off of offsets) {
            const cx = x + off[0], cy = y + off[1];
            if (this.isInside(cx, cy)) {
                handler(this.get(cx, cy), cx, cy);
            }
        }
    }

    forDirectNeighbors(x, y, handler) {
        this.forNeighborOffsets(x, y, this.directNeighborOffsets, handler);
    }

    forAllNeighbors(x, y, handler) {
        this.forNeighborOffsets(x, y, this.allNeighborOffsets, handler);
    }

    toString(cellToString = (c) => c) {
        let s = '';
        this.forEachRow((row, y) => {
            s += row.map(cellToString).join(' ');
            if (y < this.h - 1) { s += '\n'; }
        });
        return s;
    }

    slice() {
        return this.clone();
    }

    clone() {
        return new Array2D((y) => this[y].length, this.h, (x, y) => this[y][x]);
    }

    countCells(testFunc = c => !!c) {
        return this.reduceCells((v, cell, x, y) => v + (testFunc(cell, x, y) ? 1 : 0), 0);
    }

    reduceCells(reducer, initial) {
        let current = initial;
        this.forEachCell((cell, x, y) => {
            current = reducer(current, cell, x, y);
        });
        return current;
    }

    combine(otherArray2D, combiner) {
        return new Array2D(
            (y) => Math.min(this[y].length, otherArray2D[y].length),
            Math.min(this.h, otherArray2D.h),
            (x, y) => combiner(this[y][x], otherArray2D[y][x], x, y)
        );
    }

    combineWith(otherArray2D, combiner) {
        this.processCells((v, x, y) => combiner(v, otherArray2D[y][x], x, y));
    }

}

module.exports = Array2D;