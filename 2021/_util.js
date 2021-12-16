
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

function centerString(s, chars) {
    const left = Math.floor(chars / 2);
    const right = chars - left;
    s = ' '.repeat(left) + s + ' '.repeat(right);
    return s;
}

function absMod(v, div) {
    return (v > 0) ? (v % div) : ((v % div) + div);
}

function angleDiff(a1, a2) {
    const diff = absMod(a2 - a1, 2 * Math.PI);
    return diff > Math.PI ? diff - 2 * Math.PI : diff;
}

function padStart(s, char, len) {
    while (s.length < len) {
        s = char + s;
    }
    return s;
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
    padStart
};
