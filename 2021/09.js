// 6:00 - 6:06 - 6:19

const data0 = `2199943210
3987894921
9856789892
8767896789
9899965678`

const data1 = require('./09data');

class Heightmap {
  constructor(w, h, defaultValue = Infinity) {
    this.w = w;
    this.h = h;
    this.defaultValue = defaultValue;
    const row = new Array(w).fill(0);
    this.values = new Array(h).fill(null).map(_ => row.slice());
  }

  set(x, y, v) {
    this.values[y][x] = v;
  }

  get(x, y) {
    const row = this.values[y];
    const result = (row != null ? row[x] : null);
    return result == null ? this.defaultValue : result;
  }

  getNeighbors(x, y) {
    return [[-1,0],[1,0],[0,-1],[0,1]]
      .filter(diff => this.get(x + diff[0], y + diff[1]) !== this.defaultValue)
      .map(diff => [diff[0] + x, diff[1] + y]);
  }
}

function setupMap(data) {
  const rows = data.split('\n');
  const h = rows.length, w = rows[0].length;
  const map = new Heightmap(w, h);
  for (let y = 0; y < h; y++) {
    const row = rows[y].split('').map(v => +v);
    for (let x = 0; x < w; x++) {
      map.set(x, y, row[x]);
    }
  }
  return map;
}

function part1(map) {
  // Find low points
  const lowPoints = [];
  let sum = 0;
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      const nbs = map.getNeighbors(x, y);
      const v = map.get(x, y);
      if (nbs.every(nb => v < map.get(nb[0], nb[1]))) {
        sum += v + 1;
        lowPoints.push([x, y]);
      }
    }
  }
  return { sum, lowPoints };
}

function part2(map, lowPoints) {
  // Find three biggest basins
  const basins = lowPoints.map(p => findBasinSize(map, p));
  basins.sort((a, b) => a - b);
  const biggest = basins.slice(-3);
  return biggest.reduce((a, b) => a * b, 1);
}

function findBasinSize(map, p) {
  const points = [p];
  let current = 0;
  const visited = map.values.map(row => row.map(v => false));
  while (current < points.length) {
    // Test current point
    const [x, y] = points[current];
    const v = map.get(x, y);
    // Add all unvisited higher non-9 neighbors to the list
    const nbs = map.getNeighbors(x, y).filter(nb => {
      if (map.get(nb[0], nb[1]) < 9 && map.get(nb[0], nb[1]) > v && !visited[nb[1]][nb[0]]) {
        visited[nb[1]][nb[0]] = true;
        return true;
      }
      return false;
    });
    points.push(...nbs);
    // Proceed to next point
    current++;
  }
  return points.length;
}

const map = setupMap(data1);
const { sum: result1, lowPoints } = part1(map);
console.log(result1);
console.log(part2(map, lowPoints));