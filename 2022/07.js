require('./_helpers.js');
const { data0, data1 } = require('./07data');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => line.split(" "));

    // Root
    const root = {name: "/", size: 0, content: [], parent: null};

    let current = root;
    for (const line of lines) {
        interpretLine(line);
    }

    return root;

    function interpretLine(line) {
        if (line[0] === "$") {
            // Command
            switch(line[1]) {
                case "cd":
                    const name = line[2];
                    if (name == "..") {
                        current = current.parent;
                    } else if (name == "/") {
                        current = root;
                    } else {
                        current = current.content.find(child => child.name === name);
                    }
                    break;
                case "ls": // nothing to do here
                    break;
            }
        } else if (line[0] === "dir") {
            // Directory
            current.content.push({name: line[1], size: 0, content: [], parent: current})
        } else {
            // File
            current.content.push({name: line[1], size: +line[0], parent: current});
        }
    }
}

function part1(root) {
    const thresholdToCount = 100000;
    let sum = 0;
    recurse(root);
    return sum;

    function recurse(node) {
        if (node.content && node.content.length) {
            // Directory
            const size = node.content.map(recurse).sum();
            if (size < thresholdToCount) {
                sum += size;
            }
            node.size = size; // store directory size for part 2
            return size;
        } else {
            // File
            return node.size;
        }
    }
}

function part2(root) {
    const minimalSizeToFind = root.size - 40000000;
    let smallest = root, smallestSize = root.size;
    recurse(root);
    return smallestSize;

    function recurse(node) {
        if (node.content && node.content.length) {
            // Check if this directory is the smallest yet that exceeds the minimal size
            if (node.size >= minimalSizeToFind && node.size < smallestSize) {
                smallest = node;
                smallestSize = node.size;
            }
            // Recursion
            node.content.forEach(recurse);
        }
    }
}


const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));