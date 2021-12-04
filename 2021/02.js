
const list0 = `
forward 5
down 5
forward 8
up 3
down 8
forward 2`

const { list1 } = require('./02data')

let x = 0, y = 0, aim = 0

function followPath1(path) {
    for (const step of path) {
        const [command, sLength] = step.split(" ");
        const length = +sLength;
        switch (command) {
            case "forward":
                x += length;
                break;
            case "down":
                y += length;
                break;
            case "up":
                y -= length;
                break;
        }
    }
}

function followPath2(path) {
    for (const step of path) {
        const [command, sLength] = step.split(" ");
        const length = +sLength;
        switch (command) {
            case "forward":
                x += length;
                y += aim * length;
                break;
            case "down":
                aim += length;
                break;
            case "up":
                aim -= length;
                break;
        }
    }
}

followPath2(list1.split("\n"));

console.log(x, y, " -> ", x * y);