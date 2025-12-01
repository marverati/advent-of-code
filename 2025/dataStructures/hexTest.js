const HexMap = require("./HexMap");

const map = new HexMap(6, 4, (x, y) => (x * y - 5 * x + 4 * y * y + 7 * x) % 10, false, false);

console.log(map.toString());
console.log("Value at 3,2: ", map.getValue(3, 2));
map.forAllNeighbors(3, 2, (cell) => cell.value = 0);
console.log(map.toString());
console.log("Cells > 6: ", map.countCells(cell => cell.value > 6));
console.log("Sum of all cells: ", map.reduceValues((sum, v) => sum + v, 0));
console.log("Number of cells: ", map.cellCount);
const other = map.map(v => Math.random() < 0.5 ? 0 : 1);
const combined = map.combine(other, (a, b) => a * b);
console.log("Randomly nulled:");
console.log(combined.toString());