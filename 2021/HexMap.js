import { create2DArray } from "./_util";


export class HexMap {
    constructor(w, h, valueOrGenerator, secondRowLongerLeft = false, secondLowLongerRight = true) {
        const valueGen = valueOrGenerator instanceof Function ? valueOrGenerator : () => valueOrGenerator;
        const generator = (x, y) => {
            return {
                neighbors: [],
                value: valueGen(x, y)
            };
        }
        const w0 = w;
        const w1 = w - 1 + (secondRowLongerLeft ? 1 : 0) + (secondRowLongerLeft ? 1 : 0);
        this.map = create2DArray((y) => y % 2 === 0 ? w0 : w1, h, generator);
        // Setup neighbors
        this.map.forEachCell((obj, x, y) => {
            // Connect left and right
            x > 0 && obj.neighbors.push(this.map.get(x - 1, y));
            x < this.map[y].length && obj.neighbors.push(this.map.get(x + 1, y));
            // Top
            if (y > 0) {
                // ...
            }
            // Bottom
            if (y < this.map.h - 1) {
                // ...
            }
        });
    }
}