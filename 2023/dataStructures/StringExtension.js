
String.prototype.forEach = function(charHandler) {
    for (let i = 0; i < this.length; i++) {
        charHandler(this[i], i);
    }
}

String.prototype.find = function(test) {
    for (let i = 0; i < this.length; i++) {
        if (test(i)) {
            return i;
        }
    }
    return -1;
}

/** Returns a NEW string! Which is sorted alphabetically, so has the same length, but different order of characters. */
String.prototype.sort = function(criterion) {
    return this.split("").sort(criterion).join("");
}

String.prototype.getCharSet = function() {
    const result = new Set();
    this.forEach((char) => result.add(char));
    return result;
}