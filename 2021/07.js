
const data0 = `16,1,2,0,4,2,7,1,2,14`

const data1 = require('./07data');

function handleData1(data) {
  const xs = data.split(',').map(v => +v);

  const min = Math.min(... xs);
  const max = Math.max(... xs);

  // Test all possible target positions and choose best one
  let best = Infinity;
  for (let i = min; i <= max; i++) {
    const fuel = getFuel1(xs, i);
    if (fuel < best) {
      best = fuel;
      bestPos = i;
    }
  }

  return best;
}

function handleData2(data) {
  const xs = data.split(',').map(v => +v);
  const avr = getAverage(xs); 
  const cost1 = getFuel2(xs, Math.floor(avr));
  const cost2 = getFuel2(xs, Math.ceil(avr));
  return Math.min(cost1, cost2);
}

function getFuel1(xs, pos) {
  return xs.reduce((sum, x) => sum + Math.abs(x - pos), 0);
}

function getFuel2(xs, pos) {
  return xs.reduce((sum, x) => sum + naturalSum(Math.abs(x - pos)), 0);

  function naturalSum(v) {
    v = Math.abs(v);
    return v * (v + 1) / 2;
  }
}

function getAverage(values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}


console.log(handleData1(data1));