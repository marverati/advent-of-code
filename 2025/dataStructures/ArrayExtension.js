const { absMod } = require("../_util");

Array.create = function(length = 0, defaultElementOrGenerator = null) {
    const array = new Array(length);
    if (defaultElementOrGenerator instanceof Function) {
        // Generator function
        const generator = defaultElementOrGenerator;
        for (let i = 0; i < length; i++) {
            array[i] = generator(i);
        }
    } else {
        // Simple default element
        const defaultElement = defaultElementOrGenerator;
        for (let i = 0; i < length; i++) {
            array[i] = defaultElement;
        }
    }
    return array;
}

Array.prototype.count = function(filter = () => true) {
    if (!(filter instanceof Function)) {
        const value = filter;
        filter = (v) => v === value;
    }
    let count = 0;
    this.forEach(v => { if (filter(v)) { count++; } });
    return count;
}

Array.prototype.sum = function() {
    return this.reduce((sum, v) => sum + v, 0);
}

Array.prototype.product = function() {
    return this.reduce((product, v) => product * v, 1);
}

Array.prototype.max = function() {
    return Math.max(... this);
}

Array.prototype.min = function() {
    return Math.min(... this);
}

Array.prototype.withinBounds = function(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h;
}

Array.prototype.sortAsc = function() { return this.sort((a, b) => a > b ? -1 : a < b ? 1 : 0); }

Array.prototype.sortDesc = function() { return this.sort((a, b) => a > b ? 1 : a < b ? -1 : 0); }

Array.prototype.at = function(index) {
    index = absMod(index, this.length);
    return this[index];
}

Array.prototype.toObject = function(keyGenerator = v => v, valueGenerator = (v, i) => i) {
    if (!keyGenerator) { keyGenerator = v => v; }
    const obj = {};
    this.forEach((v, i) => obj[keyGenerator(v, i)] = valueGenerator(v, i));
    return obj;
}

Array.prototype.drop = function(fromIndex, count = 1) {
    const copy = this.slice();
    copy.splice(fromIndex, count);
    return copy;
}

Array.prototype.rotate = function(indexOffset) {
    indexOffset = absMod(-indexOffset, this.length);
    return [
        ...this.slice(indexOffset),
        ...this.slice(0, indexOffset),
    ];
}

Object.defineProperty(Array.prototype, 'first', {
    get: function() {
        return this[0];
    },
    set: function(value) {
        this[0] = value;
    }
});

Object.defineProperty(Array.prototype, 'last', {
    get: function() {
        return this[this.length - 1];
    },
    set: function(value) {
        this[this.length - 1] = value;
    }
});

Object.defineProperty(Array.prototype, 'lastIndex', {
    get: function() {
        return this.length - 1;
    },
    set: function(value) {
        this.length = value + 1;
    }
});