const { absMod } = require("../_util");


Array.prototype.sortAsc = function() { return this.sort((a, b) => a > b ? -1 : a < b ? 1 : 0); }

Array.prototype.sortDesc = function() { return this.sort((a, b) => a > b ? 1 : a < b ? -1 : 0); }

Array.prototype.at = function(index) {
    console.log(index);
    index = absMod(index, this.length);
    console.log(index, this.length);
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