const Array2D = require('./Array2D');

const arr = new Array2D(6, 4, (x, y) => x + y);
console.log(arr.toString() + "\n");

arr.processCells(v => (v + 3) % 10);
console.log(arr.toString() + "\n");
console.log(arr.countCells(v => v === 8), " cells have value 8");
console.log("Sum of all cells is ", arr.reduceCells((sum, v) => sum + v, 0));