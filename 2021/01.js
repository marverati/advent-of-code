
const data = require('./01data');

function countSlidingIncreases(list, size = 3) {
    let count = 0;
    for (let i = size; i < list.length; i++) {
        if (list[i] > list[i - size]) { count++; }
    }
    return count;
}

console.log(countSlidingIncreases(data.list1, 1));
console.log(countSlidingIncreases(data.list1, 30));





