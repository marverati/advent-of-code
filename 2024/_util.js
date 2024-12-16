

// Paste & execute in console of input data to turn long-winded list into compact array
function listToArray() {
    const txt = document.body.textContent;
    const lines = txt.split("\n").filter(l => l.trim().length > 0);
    let result = "[" + lines.join(",") + "]";
    let chars = 0;
    for (let i = 0; i < result.length; i++) {
        chars++;
        if (chars > 120 && result[i] === ",") {
            // Insert line break after
            result = result.substr(0, i + 1) + "\n" + result.substr(i + 1);
            chars = -1;
        }
    }

    document.body.textContent = result;
    document.body.style.whiteSpace = "pre-line";

    return result;
}



function assert(name, check, error) {
    if (!check) {
        let errorMessage = `Assertion failed: ${name}`;
        if (error) {
            errorMessage += ` (${error})`;
        }
        throw new Error(errorMessage);
    }
}

function assertEqual(name, actual, expected) {
    if (actual !== expected) {
        const errorMessage = `Assertion failed: ${name} - Got ${actual}, expected ${expected}`;
        throw new Error(errorMessage);
    }
}

/**
 * Depth first search through any data structure. Make sure that getNeighborsFn returns
 * stable object references, and doesn't generate them on the fly. Alternatively you can
 * provide an elToReference function that e.g. maps your objects to strings that act as
 * unique keys for different elements, which can e.g. be useful when you're dealing with
 * 2D coordinates rather than actual objets.
 * searchFn should be your search criterion that maps elements to boolean - when true
 * is returned, the search stops.
 * Return value will be either an array of elements, starting with the startElement
 * and leading up to the first found element with searchFn == true, or null if no
 * such path could be found.
 */
function dfs(startElement, getNeighborsFn, searchFn, handleElement = () => {}, elToReference = (v) => v) {
    const visited = new Set();
    visited.add(elToReference(startElement));
    const path = recurse(startElement);
    return path;

    function recurse(el) {
        handleElement(el);
        if (searchFn(el)) {
            return [el];
        }
        const nbs = getNeighborsFn(el);
        for (const nb of nbs) {
            const ref = elToReference(nb)
            if (!visited.has(ref)) {
                visited.add(ref);
                const path = recurse(nb);
                if (path) {
                    path.unshift(el);
                    return path;
                }
            }
        }
        return null;
    }
}

/**
 * Breadth first search through any data structure. Make sure that getNeighborsFn returns
 * stable object references, and doesn't generate them on the fly. Alternatively you can
 * provide an elToReference function that e.g. maps your objects to strings that act as
 * unique keys for different elements, which can e.g. be useful when you're dealing with
 * 2D coordinates rather than actual objets.
 * searchFn should be your search criterion that maps elements to boolean - when true
 * is returned, the search stops.
 * handleElement is an optional function that will be called for every traversed element
 * in the graph (independent of the result of searchFn).
 * Return value will be either an array of elements, starting with the startElement
 * and leading up to the first found element with searchFn == true, or null if no
 * such path could be found.
 */
function bfs(startElement, getNeighborsFn, searchFn, handleElement = () => {}, elToReference = (v) => v) {
    const visited = new Set();
    const elements = [ { el: startElement, from: -1 } ];
    visited.add(elToReference(elements[0].el));
    handleElement(elements[0].el);
    let current = 0, found = -1;
    while (current < elements.length && found < 0) {
        // Handle current element
        const el = elements[current].el;
        const nbs = getNeighborsFn(el);
        // Add all unvisited neighbors to the end of the list
        for (const nb of nbs) {
            const ref = elToReference(nb);
            if (!visited.has(ref)) {
                visited.add(ref);
                const newElement = { el: nb, from: current };
                elements.push(newElement);
                handleElement(newElement.el)
                if (searchFn(nb, el)) {
                    found = current;
                    break;
                }
            }
        }
        // Proceed
        current++;
    }
    
    // Reconstruct path
    if (found >= 0) {
        let i = found;
        const path = [];
        while (i >= 0) {
            path.unshift(elements[i].el);
            i = elements[i].from;
        }
        return path;
    }
    return null;
}

function floodFill(startElement, getNeighborsFn, handleElement, elToReference = (v) => v) {
    const result = [];
    bfs(
        startElement,
        getNeighborsFn,
        () => false, // flood fill is not searching for an element, but wants to reach every possible point
        handleElement,
        elToReference
    );
}

// *** NUMBERS ***

/**
 * Inclusive between check.
 * @param {number} num 
 * @param {number} min 
 * @param {number} max 
 * @returns True if num is inside [min, max], false otherwise.
 */
function between(num, min, max) {
    return num >= min && num <= max;
}

function isInt(num) {
    return !isNaN(num) && isFinite(num) && num === Math.floor(num);
}

function getMedian(numbers) {
    const list = numbers.slice();
    list.sort((a, b) => a - b);
    const mid = (list.length - 1) / 2;
    if (mid === Math.floor(mid)) {
        return list[mid];
    } else {
        return (list[Math.floor(mid)] + list[Math.ceil(mid)]) / 2;
    }
}

function getMean(numbers) {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function getMin(numbers) {
    return numbers.reduce((a, b) => a < b ? a : b, Infinity);
}

function getMinIndex(...indices) {
    return indices.map(cleanIndex).min();
}

function cleanIndex(index) {
    return index < 0 ? Infinity : index;
}

function getMax(numbers) {
    return numbers.reduce((a, b) => a > b ? a : b, -Infinity);
}

function absMod(v, div) {
    return ((v % div) + div) % div;
}

function angleDiff(a1, a2) {
    const diff = absMod(a2 - a1, 2 * Math.PI);
    return diff > Math.PI ? diff - 2 * Math.PI : diff;
}

function getOverlap(from1, to1, from2, to2) {
    if (to1 < from1) { const tmp = to1; to1 = from1; from1 = tmp; }
    if (to2 < from2) { const tmp = to2; to2 = from2; from2 = tmp; }
    const from = Math.max(from1, from2);
    const to = Math.min(to1, to2);
    if (from <= to) {
        return [from, to];
    }
    return null;
}

function overlaps(from1, to1, from2, to2) {
    if (to1 < from1) { const tmp = to1; to1 = from1; from1 = tmp; }
    if (to2 < from2) { const tmp = to2; to2 = from2; from2 = tmp; }
    return !(to1 < from2 || from1 > to2);
}

function fullyContains(from1, to1, from2, to2, checkBothDirections = false) {
    if (to1 < from1) { const tmp = to1; to1 = from1; from1 = tmp; }
    if (to2 < from2) { const tmp = to2; to2 = from2; from2 = tmp; }
    if (from1 <= from2 && to1 >= to2) {
        return true;
    }
    if (checkBothDirections) {
        return fullyContains(from2, to2, from1, to1, false);
    }
    return false;
}

function getLowestCommonMultiple(nums) {
    let result = nums[0];
    for (let i = 1; i < nums.length; i++) {
        result = getPairwiseMultiple(result, nums[i]);
    }
    return result;

    function getPairwiseMultiple(a, b) {
        let v = Math.max(a, b), other = Math.min(a, b);
        const step = v;
        while (other * Math.floor(v / other) !== v) {
            v += step;
        }
        return v;
    }
}

// *** STRINGS ***

function centerString(s, chars) {
    const left = Math.floor(chars / 2);
    const right = chars - left;
    s = ' '.repeat(left) + s + ' '.repeat(right);
    return s;
}

function padStart(s, char, len) {
    while (s.length < len) {
        s = char + s;
    }
    return s;
}

function dropFromString(s, pos, length = 1) {
    return s.substring(0, pos) + s.substring(pos + length);
}

function cutString(s, atPos) {
    return [
        s.substring(0, atPos),
        s.substring(atPos)
    ];
}

function cutStringMultiple(s, charLength) {
    if (charLength < 1) { throw new Error('invalid character length for splitting string: ' + charLength); }
    const result = [];
    for (let i = 0; i < s.length; i += charLength) {
        result.push(s.substring(i, i + charLength));
    }
    return result;
}

// *** MISC ***

function sortNums(array, descending = false) {
    if (descending) {
        array.sort((a, b) => b - a);
    } else {
        array.sort((a, b) => a - b);
    }
}

function range(min, maxExclusive) {
    const result = [];
    for (let i = min; i < maxExclusive; i++) {
        result.push(i);
    }
    return result;
}

function zip(arr1, arr2, handler) {
    if (arr1.length !== arr2.length) {
        throw new Error('Trying to zip arrays of different lengths: ', arr1.length, 'vs', arr2.length);
    }
    for (let i = 0; i < arr1.length; i++) {
        handler(arr1[i], arr2[i], i);
    }
}

function zipMap(arr1, arr2, mapper) {
    const result = [];
    zip(arr1, arr2, (a, b) => result.push(mapper(a, b)));
    return result;
}

function pairwise(array, handler) {
    for (let i = 1; i < array.length; i++) {
        if (handler(array[i - 1], array[i], i - 1, i) === false) {
            return
        }
    }
}

/**
 * Iterator, emitting adjacent pairs of values and indices.
 * @param {*} array 
 */
function* yieldPairs(report) {
    for (let i = 0; i < report.length - 1; i++) {
        yield [report[i], report[i + 1]];
    }
}

/**
 * Returns an array of pairs of adjacent values and indices from the input array.
 * @param {*} array 
 * @returns 
 */
function getPairs(array) {
    return [...yieldPairs(array)];
}

function deepCopy(obj) {
    if (obj instanceof Array) {
        // array
        return obj.map(v => deepCopy(v));
    } else if (obj instanceof Object) {
        // object
        const result = {};
        for (const key of Object.keys(obj)) {
            result[key] = deepCopy(obj[key]);
        }
        return result;
    } else {
        // primitive data type
        return obj;
    }
}

function sleep(d) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, d);
    });
}

function logDelayed(...args) {
    setTimeout(() => {
        console.log(...args);
    }, 0)
}

function logTime(caption, callback) {
    const t0 = Date.now();
    const result = callback();
    const time = Date.now() - t0;
    console.log(caption, result, ' (in ' + time + 'ms)');
}

const PROGRESS_DIFF = 2000;
let lastProgressLog = Date.now();
let progressStart = Date.now();
let lastProgress = 0;
function logProgress(caption, p, of = 1, estimate = true) {
    if (!caption) { caption = "Progress: "; }
    if (p <= 0) {
        progressStart = Date.now();
    }
    const t = Date.now();
    if (t - lastProgressLog > PROGRESS_DIFF) {
        const percent = (100 * p / of).toFixed(2);
        let estimation = "";
        if (estimate) {
            const duration = t - progressStart;
            const durationSinceLastStep = t - lastProgressLog;
            const changeSinceLastStep = (p / of) - lastProgress;
            const velocity = changeSinceLastStep / durationSinceLastStep;
            const remainingTime = (of - p) / of / velocity;
            const remaining = (t > progressStart) ? (remainingTime / 1000).toFixed(3) + "s" : "..."
            estimation = " (duration: " + (duration / 1000).toFixed(3) + "s, remaining: ~" + remaining + ")";
        }
        console.log(caption, percent + "% " + estimation);
        lastProgressLog = t;
        lastProgress = p / of;
    }
}

module.exports = {
    assert,
    assertEqual,
    dfs,
    bfs,
    floodFill,
    between,
    isInt,
    getMedian,
    getMean,
    getMin,
    getMax,
    cleanIndex,
    getMinIndex,
    centerString,
    absMod,
    angleDiff,
    getLowestCommonMultiple,
    padStart,
    dropFromString,
    sortNums,
    range,
    zip,
    zipMap,
    pairwise,
    getPairs,
    yieldPairs,
    getOverlap,
    overlaps,
    fullyContains,
    cutString,
    cutStringMultiple,
    deepCopy,
    sleep,
    logDelayed,
    logTime,
    logProgress,
};
