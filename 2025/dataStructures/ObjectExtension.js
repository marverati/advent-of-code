

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
        const newValue = valueMapper(this[key], key, newKey);
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

/**
 * Traces a path through the object via the provided getter, gathering
 * objects until a falsy value is encountered. All truthy values will
 * be returned in an array in order of traversal.
 * If a string is provided, the corresponding object key will be
 * searched (which primarily makes sense of the property of that
 * name yields objects of the same type).
 *
 * @param {Function | string} getterOrKey 
 * @param {number?} maxCount 
 * @returns 
 */
Object.prototype.traverseChain = function(getterOrKey, maxCount = Infinity) {
    let getter = getterOrKey;
    if (typeof getterOrKey === 'string') {
        getter = (obj) => obj[getterOrKey];
    }
    let obj = this;
    const result = [];
    for (let i = 0; i < maxCount && obj; i++) {
        result.push(obj);
        obj = getter(obj);
    }
    return result;
}