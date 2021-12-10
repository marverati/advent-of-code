
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

function create2DArray(wOrFunction, h, valueOrGenerator) {
    const map = [];
    const generator = valueOrGenerator instanceof Function ? valueOrGenerator : () => valueOrGenerator;
    for (let y = 0; y < h; y++) {
        map[y] = [];
        const w = wOrFunction instanceof Function ? wOrFunction(y) : wOrFunction;
        for (let x = 0; x < w; x++) {
            map[y][x] = generator();
        }
    }
    map.forEachCell = (handler) => {
        for (let y = 0; y < h; y++) {
            const row = map[y], l = row.length;
            for (let x = 0; x < l; x++) {
                handler(row[x], x, y);
            }
        }
    };
    map.forEachRow = (handler) => {
        for (let y = 0; y < h; y++) {
            handler(map[y], y);
        }
    };
    map.isInside = (x, y) => x === (x << 0) && y === (y << 0) && x >= 0 && y >= 0 && y < map.h && x < map[y].length;
    map.get = (x, y) => map.isInside(x, y) ? map[y][x] : null;
    map.set = (x, y, v) => {
        if (map.isInside(x, y)) {
            map[y][x] = v;
        } else {
            throw new Error("Setting illegal map position: " + x + "," + y);
        }
    }
    return map;
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

module.exports = {
    dfs,
    bfs,
    floodFill,
    create2DArray,
    getMedian,
    getMean
};
