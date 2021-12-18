

const data0 = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

const { data1 } = require('./18data');

class SnailTree {
    constructor(parent, leftOrValue, right) {
        // Find separating comma
        this.parent = parent;
        if (right) {
            this.left = leftOrValue instanceof SnailTree ? leftOrValue : SnailTree.fromString(leftOrValue, this);
            this.right = right instanceof SnailTree ? right : SnailTree.fromString(right, this);
            this.left.parent = this;
            this.right.parent = this;
            this.value = null;
        } else {
            this.value = leftOrValue;
            this.left = null;
            this.right = null;
        }
    }

    static fromString(s, parent = null) {
        const parts = splitByComma(s);
        if (parts instanceof Array && parts.length === 2) {
            return new SnailTree(parent, parts[0], parts[1]);
        } else {
            return new SnailTree(parent, +parts);
        }
    }

    toString() {
        if (this.value != null) {
            return this.value;
        } else {
            const l = this.left ? this.left.toString() : '?';
            const r = this.right ? this.right.toString() : '?';
            return "[" + l + "," + r + "]";
        }
    }

    reduce() {
        // Explosions
        if (this.left._reduce(1, true, false)) return true;
        if (this.right._reduce(1, true, false)) return true;
        // Splits
        if (this.left._reduce(1, false, true)) return true;
        if (this.right._reduce(1, false, true)) return true;
        return false;
    }

    _reduce(depth = 0, exp, spl) {
        if (exp && this.value == null && depth >= 4) {
            this.explode();
            return true;
        }
        if (spl && this.value != null && this.value >= 10) {
            this.split();
            return true;
        }
        if (this.value == null) {
            depth++;
            // Children
            if (this.left._reduce(depth, exp, spl)) return true;
            if (this.right._reduce(depth, exp, spl)) return true;
        }
        return false;
    }

    explode() {
        if (this.value || this.left.value == null || this.right.value == null) {
            throw new Error("Exploding non-parent of two regular numbers: " + this.toString());
        }
        const left = this.getToTheLeft();
        left && left.increase(this.left.value); // exploding pairs always consist of 2 regular numbers
        const right = this.getToTheRight();
        right && right.increase(this.right.value);
        // Nullify self
        this.left = null;
        this.right = null;
        this.value = 0;
    }

    split() {
        const v = this.value;
        this.value = null;
        this.left = new SnailTree(this, Math.floor(v / 2));
        this.right = new SnailTree(this, Math.ceil(v / 2));
    }

    increase(by) {
        if (this.value == null) {
            throw new Error("Increasing non-regular number " + this.toString());
        }
        this.value += by;
    }

    getToTheLeft() {
        let node = this;
        // Step up until
        while (node.parent && node.parent.left === node) {
            node = node.parent;
        }
        // If exists, we're now finally stepping to the left
        node = node.parent;
        if (!node) { return null; }
        // Now pick rightmost child of left child of parent
        node = node.left;
        while (node.right) {
            node = node.right;
        }
        // No more children -> must be regular number
        return node;
    }

    getToTheRight() {
        let node = this;
        // Step up until
        while (node.parent && node.parent.right === node) {
            node = node.parent;
        }
        // If exists, we're now finally stepping to the right
        node = node.parent;
        if (!node) { return null; }
        // Now pick leftmost child of right child of parent
        node = node.right;
        while (node.left) {
            node = node.left;
        }
        // No more children -> must be regular number
        return node;
    }

    getAddition(other) {
        if (this.parent || other.parent) {
            throw new Error("Can't add already nested SnailTrees: " + this.toString(), other.toString());
        }
        return new SnailTree(null, this, other);
    }

    getRoot() {
        return !this.parent ? this : this.parent.getRoot();
    }

    getMagnitude() {
        if (this.value != null) {
            return this.value;
        } else {
            return 3 * this.left.getMagnitude() + 2 * this.right.getMagnitude();
        }
    }
}

function splitByComma(s) {
    let depth = 0;
    let found = false;
    let commaPos = -1, startPos = -1, endPos = -1;
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if ((c) === "[") {
            depth++;
            found = true;
            if (startPos < 0) { startPos = i; }
        } else if (c === "]") {
            depth--;
            found = true;
            if (depth === 0 && endPos < 0) { endPos = i; }
        } else if (c === ",") {
            found = true;
            if (depth === 1 && commaPos < 0) { commaPos = i; }
        }
    }
    if (commaPos >= 0 && startPos >= 0 && endPos >= 0) {
        return [ s.substr(startPos + 1, commaPos - startPos - 1), s.substr(commaPos + 1, endPos - commaPos - 1 ) ];
    }
    // No such chars -> literal
    if (!found) {
        return +s;
    }
    // Error
    throw new Error("String parsed meh: " + s);
}

function prepareData(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line !== "");
    return lines;
}

function part1(lines) {
    lines = lines.slice();
    let tree = SnailTree.fromString(lines[0]);
    while (lines.length > 1) {
        const other = SnailTree.fromString(lines[1]);
        tree = tree.getAddition(other);
        lines.splice(1, 1);
        while(tree.reduce()) {}
    }
    return tree.getMagnitude();
}

function part2(lines) {
    let largest = -Infinity;
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines.length; j++) {
            if (i == j) { continue; }
            const t1 = SnailTree.fromString(lines[i]);
            const t2 = SnailTree.fromString(lines[j]);
            const sum = t1.getAddition(t2);
            while (sum.reduce()) {}
            const result = sum.getMagnitude();
            if (result > largest) {
                largest = result;
            }
        }
    }
    return largest;
}

const data = prepareData(data1);
console.log("Part 1: ", part1(data));
console.log("Part 2: ", part2(data));