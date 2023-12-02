

Object.prototype.mapValues = function(mapper) {
    const result = {};
    const keys = Object.keys(this);
    for (const key of keys) {
        const value = this[key];
        const newValue = mapper(value, key);
        result[key] = newValue;
    }
    return result;
}

Object.prototype.mapKeys = function(keyMapper, valueMapper = (v) => v) {
    const result = {};
    const keys = Object.keys(this);
    for (const key of keys) {
        const newKey = keyMapper(key);
        const value = this[key];
        const newValue = keyMapper(value, key, newKey);
        result[newKey] = newValue;
    }
    return result;
}

Object.prototype.getKeys = function() {
    return Object.keys(this);
}

Object.prototype.getValues = function() {
    return Object.values(this);
}

Object.prototype.filterKeys = function(filterFunc) {
    const result = {};
    const keys = Object.keys(this);
    for (const key of keys) {
        if (filterFunc(key)) {
            result[key] = this[key];
        }
    }
    return result;
}

Object.prototype.filterValues = function(filterFunc) {
    const result = {};
    const keys = Object.keys(this);
    for (const key of keys) {
        const value = this[key];
        if (filterFunc(value, key)) {
            result[key] = value;
        }
    }
    return result;
}
