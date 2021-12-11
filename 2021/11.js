
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
  const map = [];
  for (let y = 0; y < lines.length; y++) {
    map[y] = [];
    for (let x = 0; x < lines[0].length; x++) {
      map[y][x] = {
        energy: +lines[y][x],
        flashed: false
      };
    }
  }
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
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      row[x].energy++;
    }
  }
  // Cascading flashes
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x].energy > 9 && !row[x].flashed) {
        flashes += flash(map, x, y);
      }
    }
  }
  // Reset energy
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x].flashed) {
        row[x].energy = 0;
        row[x].flashed = false;
      }
    }
  }
  return flashes;
}

function flash(map, x, y) {
  let count = 1;
  map[y][x].flashed = true;
  // Raise neighbors
  for (let cy = y - 1; cy <= y + 1; cy++) {
    for (let cx = x - 1; cx <= x + 1; cx++) {
      if (map[cy] && map[cy][cx] && (cx !== x || cy !== y)) {
        count += raise(map, cx, cy);
      }
    }
  }
  return count;
}

function raise(map, x, y) {
  let count = 0;
  map[y][x].energy++;
  if (map[y][x].energy > 9 && !map[y][x].flashed) {
    count += flash(map, x, y);
  }
  return count;
}


let map = prepareData(data1);
console.log("Part 1: ", part1(map));
map = prepareData(data1);
console.log("Part 2: ", part2(map));