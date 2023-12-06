
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

/**
 * Breadth first search through any data structure. Make sure that getNeighborsFn returns
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

function getMax(numbers) {
    return numbers.reduce((a, b) => a > b ? a : b, -Infinity);
}

function absMod(v, div) {
    return (v >= 0) ? (v % div) : ((v % div) + div);
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

function range(min, maxExclusive) {
    const result = [];
    for (let i = min; i < maxExclusive; i++) {
        result.push(i);
    }
    return result;
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

function logTime(caption, callback) {
    const t0 = Date.now();
    const result = callback();
    const time = Date.now() - t0;
    console.log(caption, result, ' (in ' + time + 'ms)');
}

const PROGRESS_DIFF = 5000;
let lastProgressLog = -Infinity;
function logProgress(caption, p, of = 1) {
    const t = Date.now();
    if (t - lastProgressLog > PROGRESS_DIFF) {
        lastProgressLog = t;
        const percent = (100 * p / of).toFixed(2);
        if (caption == null) {
            console.log("Progress: ", percent + "%");
        } else {
            console.log(percent + "%");
        }
    }
}

module.exports = {
    dfs,
    bfs,
    floodFill,
    getMedian,
    getMean,
    getMin,
    getMax,
    centerString,
    absMod,
    angleDiff,
    padStart,
    range,
    getOverlap,
    overlaps,
    fullyContains,
    cutString,
    cutStringMultiple,
    deepCopy,
    logTime,
    logProgress,
};
