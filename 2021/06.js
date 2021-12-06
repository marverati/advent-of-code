// const data0 = `3,4,3,1,2`

const data0 = `1,1,1,1,1,1,1,4,1,2,1,1,4,1,1,1,5,1,1,1,1,1,1,1,1,1,1,1,1,5,1,1,1,1,3,1,1,2,1,2,1,3,3,4,1,4,1,1,3,1,1,5,1,1,1,1,4,1,1,5,1,1,1,4,1,5,1,1,1,3,1,1,5,3,1,1,1,1,1,4,1,1,1,1,1,2,4,1,1,1,1,4,1,2,2,1,1,1,3,1,2,5,1,4,1,1,1,3,1,1,4,1,1,1,1,1,1,1,4,1,1,4,1,1,1,1,1,1,1,2,1,1,5,1,1,1,4,1,1,5,1,1,5,3,3,5,3,1,1,1,4,1,1,1,1,1,1,5,3,1,2,1,1,1,4,1,3,1,5,1,1,2,1,1,1,1,1,5,1,1,1,1,1,2,1,1,1,1,4,3,2,1,2,4,1,3,1,5,1,2,1,4,1,1,1,1,1,3,1,4,1,1,1,1,3,1,3,3,1,4,3,4,1,1,1,1,5,1,3,3,2,5,3,1,1,3,1,3,1,1,1,1,4,1,1,1,1,3,1,5,1,1,1,4,4,1,1,5,5,2,4,5,1,1,1,1,5,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,5,1,1,1,1,1,1,3,1,1,2,1,1`


function handleInput(data, days) {
  const fishes = data.split(',').map(v => +v);
  // Create fish age histogram
  const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const f of fishes) { counts[f]++; }
  console.log("Initial state:", counts.join(","), countFishes(counts));

  for (let i = 0; i < days; i++) {
    updateCount(counts);
  }

  return countFishes(counts);
}

function countFishes(counts) {
  return counts.reduce((a, b) => a + b, 0);
}

function updateCount(count) {
  const newFishCount = count.shift();
  count[6] += newFishCount; // new parents
  count.push(newFishCount); // offspring
}

console.log(handleInput(data0, 256));