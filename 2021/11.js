const { create2DArray } = require("./_util");

// Test input
const data0 = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

// Actual input
const data1 = `5665114554
4882665427
6185582113
7762852744
7255621841
8842753123
8225372176
7212865827
7758751157
1828544563`;

function prepareData(data) {
  const lines = data.split("\n");
  const map = create2DArray(10, 10, (x, y) => ({
    energy: +lines[y][x],
    flashed: false
  }));
  return map;
}

function part1(map, steps = 100) {
  let flashes = 0;
  for (let step = 0; step < steps; step++) {
    flashes += runStep(map);
  }
  return flashes;
}

function part2(map, maxSteps = 1000000) {
  const elementCount = map.length * map[0].length;
  for (let step = 1; step <= maxSteps; step++) {
    const stepFlashes = runStep(map);
    if (stepFlashes === elementCount) {
      return step;
    }
  }
  return -1;
}

function runStep(map) {
  let flashes = 0;
  // Increase energy
  map.forEachCell(cell => cell.energy++);
  // Cascading flashes
  map.forEachCell((cell, x, y) => {
    if (cell.energy > 9 && !cell.flashed) {
      flashes += flash(map, x, y);
    }
  });
  // Reset energy
  map.forEachCell((cell) => {
    if (cell.flashed) {
      cell.flashed = false;
      cell.energy = 0;
    }
  });
  return flashes;
}

function flash(map, x, y) {
  let count = 1;
  map.get(x, y).flashed = true;
  // Raise neighbors
  map.forAllNeighbors(x, y, (_cell, cx, cy) => {
    count += raise(map, cx, cy);
  });
  return count;
}

function raise(map, x, y) {
  let count = 0;
  const cell = map.get(x, y);
  cell.energy++;
  if (cell.energy > 9 && !cell.flashed) {
    count += flash(map, x, y);
  }
  return count;
}

console.log("Part 1: ", part1(prepareData(data1)));
console.log("Part 2: ", part2(prepareData(data1)));