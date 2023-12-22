
Set.prototype.map = function(mapper) {
    return Array.from(this).map(mapper);
}

Set.prototype.every = function(tester) {
    for (const element of this) {
        if (!tester(element)) {
            return false;
        }
    }
    return true;
};

Set.prototype.some = function(tester) {
    for (const element of this) {
        if (tester(element)) {
            return true;
        }
    }
    return false;
};

