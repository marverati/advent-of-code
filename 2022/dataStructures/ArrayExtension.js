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
    let count = 0;
    this.forEach(v => { if (filter(v)) { count++; } });
    return count;
}

Array.prototype.sortAsc = function() { return this.sort((a, b) => a > b ? -1 : a < b ? 1 : 0); }

Array.prototype.sortDesc = function() { return this.sort((a, b) => a > b ? 1 : a < b ? -1 : 0); }

Array.prototype.at = function(index) {
    index = absMod(index, this.length);
    return this[index];
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