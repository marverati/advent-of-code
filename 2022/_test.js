const Array2D = require("./dataStructures/Array2D");
const { cutString, cutStringMultiple, getOverlap, deepCopy } = require("./_util");
require("./dataStructures/ArrayExtension");
require("./dataStructures/StringExtension");

const tests = {
    'cutString': () => {
        expectArray(cutString("test", 2), ["te","st"]);
        expectArray(cutString("test", 0), ["", "test"]);
        expectArray(cutString("test", -1), ["", "test"]);
        expectArray(cutString("test", 200), ["test",""]);
        expectArray(cutString("this is a test", 8), ["this is ","a test"]);
    },
    'cutStringMultiple': () => {
        expectArray(cutStringMultiple("test", 1), ["t","e","s","t"]);
        expectArray(cutStringMultiple("12345678", 2), ["12","34","56","78"]);
        expectArray(cutStringMultiple("12345678", 5), ["12345", "678"]);
    },
    'getOverlap': () => {
        expectArray(getOverlap(0, 7, 10, 20), null, "1 smaller than 2");
        expectArray(getOverlap(30, 37, 10, 20), null, "2 smaller than 1");
        expectArray(getOverlap(7, 0, 10, 20), null, "inverse 1 smaller than 2");
        expectArray(getOverlap(0, 7, 20, 10), null, "1 smaller than inverse 2");
        expectArray(getOverlap(0, 100, 23, 42), [23, 42], "1 contains 2");
        expectArray(getOverlap(23, 42, 0, 100), [23, 42], "2 contains 1");
        expectArray(getOverlap(0, 100, 60, 250), [60, 100], "forward overlap");
        expectArray(getOverlap(60, 250, 0, 100), [60, 100], "backward overlap");
        expectArray(getOverlap(100, 0, 23, 42), [23, 42], "inverse 1 contains 2");
        expectArray(getOverlap(0, 100, 42, 23), [23, 42], "1 contains inverse 2");
        expectArray(getOverlap(100, 0, 42, 23), [23, 42], "inverse 1 contains inverse 2");
        expectArray(getOverlap(100, 0, 60, 250), [60, 100], "inverse forward overlap");
        expectArray(getOverlap(100, 0, 250, 60), [60, 100], "double inverse forward overlap");
    },
    'deepCopy': () => {
        // Primitives
        expect(deepCopy(null), null);
        expect(deepCopy(undefined), undefined);
        expect(deepCopy(3), 3);
        expect(deepCopy(0), 0);
        expect(deepCopy(-42), -42);
        expect(deepCopy(Infinity), Infinity);
        expect(deepCopy(''), '');
        expect(deepCopy('Hello World'), 'Hello World');
        expect(deepCopy('\n'), '\n');
        expect(deepCopy(false), false);
        expect(deepCopy(true), true);
        // Arrays
        expectObject(deepCopy([]), []);
        expectObject(deepCopy([null]), [null]);
        expectObject(deepCopy([1, 2, 3, 5]), [1, 2, 3, 5]);
        expectObject(deepCopy([null, 42, undefined, 'hello']), [null, 42, undefined, 'hello']);
        expectObject(deepCopy(
            [[3], '', [[2], 4, [5, [6]]]]),
            [[3], '', [[2], 4, [5, [6]]]]
        );
        expectObject(deepCopy(
            [42, { key: 'value', other: -5, more: null, list: [1, 2, {obj: 1337}]}]),
            [42, { key: 'value', other: -5, more: null, list: [1, 2, {obj: 1337}]}]
        );
        // Objects
        expectObject(deepCopy({}), {});
        expectObject(deepCopy({a: null}), {a: null});
        expectObject(deepCopy({test: 42, more: 1337}), {test: 42, more: 1337});
        expectObject(deepCopy({list: [1, 2], obj: { test: 42}}), {list: [1, 2], obj: { test: 42}});
        expectObject(deepCopy({list: [[0, [42, 1, 2, [3, 4, [[5]]]]]]}), {list: [[0, [42, 1, 2, [3, 4, [[5]]]]]]});
        expectObject(deepCopy({obj: {obj: {obj: 42}}}), {obj: {obj: {obj: 42}}});
    },
    'Array.create': () => {
        // Fixed default value
        expectArray(Array.create(0, 42), [], "empty");
        expectArray(Array.create(1, 42), [42]);
        expectArray(Array.create(2, 42), [42, 42]);
        expectArray(Array.create(7, 42), [42, 42, 42, 42, 42, 42, 42]);
        expectArray(Array.create(4), [null, null, null, null]);
        expect(Array.create(159).length, 159);
        expect(Array.create(159, 0).length, 159);
        expect(Array.create(159, "test").length, 159);
        expect(Array.create(159, [42]).length, 159);
        // Generator functions
        expectArray(Array.create(4, (i) => i), [0, 1, 2, 3]);
        expectArray(Array.create(6, (i) => 2), [2, 2, 2, 2, 2, 2]);
        expectArray(Array.create(0, (i) => i ** i), []);
        expectArray(Array.create(4, (i) => i ** i), [1, 1, 4, 27]);
        expectArray(Array.create(4, (i) => i % 2 ? 1 : '0'), ['0', 1, '0', 1]);
    },
    'Array2D.flip': () => {
        expectArray(new Array2D(4, 1, (x, y) => x).flip(), [[0, 1, 2, 3]]);
        expectArray(new Array2D(1, 4, (x, y) => y).flip(), [[3], [2], [1], [0]]);
        expectArray(new Array2D(2, 2, (x, y) => x + 2 * y).flip(), [[2, 3], [0, 1]]);
    },
    'Array2D.mirror': () => {
        expectArray(new Array2D(4, 1, (x, y) => x).mirror(), [[3, 2, 1, 0]]);
        expectArray(new Array2D(1, 4, (x, y) => y).mirror(), [[0], [1], [2], [3]]);
        expectArray(new Array2D(2, 2, (x, y) => x + 2 * y).mirror(), [[1, 0], [3, 2]]);
    },
    'Array2D.transpose': () => {
        expectArray(new Array2D(4, 1, (x, y) => x).transpose(), [[0], [1], [2], [3]]);
        expectArray(new Array2D(1, 4, (x, y) => y).transpose(), [[0, 1, 2, 3]]);
        expectArray(new Array2D(2, 2, (x, y) => x + 2 * y).transpose(), [[0, 2], [1, 3]]);
    },
    'String.prototype.sort': () => {
        expect("test".sort(), "estt");
        expect("aAbBcC".sort(), "ABCabc");
        expect("this is a test".sort(), "   aehiisssttt");
    },
    'String.prototype.getCharSet': () => {
        expectArray(Array.from("".getCharSet()), []);
        expectArray(Array.from("test".getCharSet()), ["t", "e", "s"]);
        expectArray(Array.from("aAbB".getCharSet()), ["a", "A", "b", "B"]);
    },
}

function testAll() {
    const testNames = Object.keys(tests);
    let failed = 0;
    for (const test of testNames) {
        try {
            tests[test]();
        } catch(e) {
            failed++;
            console.error(`Test '${test}' failed: ${e}`);
        }
    }
    if (failed === 0) {
        console.log(`All ${testNames.length} tests passed`);
    } else {
        console.error(`${failed} / ${testNames.length} tests failed`);
    }
}
testAll();

function expect(actualValue, expectedValue, name = "") {
    if (actualValue !== expectedValue) {
        throw new Error(name + shortenString(actualValue) + " != " + shortenString(expectedValue));
    }
}

function expectArray(actualValue, expectedValue, name = "") {
    if (!isArrayEqual(actualValue, expectedValue)) {
        expect(actualValue, expectedValue, name); // will throw
    }
}

function isArrayEqual(array1, array2) {
    let isEqual = true;
    if (array1 === array2) {
        return true;
    }
    if ((array1 == null) !== (array2 == null)) {
        isEqual = false;
    } else if (array1 && array2 && array1.length !== array2.length) {
        isEqual = false;
    } else {
        // compare values
        for (let i = 0; i < array1.length; i++) {
            if (!isObjectEqual(array1[i], array2[i])) {
                isEqual = false;
                break;
            }
        }
    }
    return isEqual;
}

function expectObject(actualValue, expectedValue, name = "") {
    if (!isObjectEqual(actualValue, expectedValue)) {
        expect(actualValue, expectedValue, name); // will throw
    }

}

function isObjectEqual(object1, object2) {
    let isEqual = true;
    if (object1 === object2) {
        return true;
    }
    if ((object1 == null) !== (object2 == null)) {
        isEqual = false;
    } else {
        if (object1 instanceof Array && object2 instanceof Array) {
            // Array
            return isArrayEqual(object1, object2);
        } else if (object1 instanceof Object && object2 instanceof Object) {
            // Object
            const keys1 = Object.keys(object1);
            const keys2 = Object.keys(object2);
            if (isArrayEqual(keys1, keys2)) {
                // go through keys one by one
                for (const key of Object.keys(object1)) {
                    if (!isObjectEqual(object1[key], object2[key])) {
                        isEqual = false;
                        break;
                    }
                }
            } else {
                isEqual = false;
            }
        } else {
            // primitive data type, and no early exit before -> must differ
            isEqual = false;
        }
    }
    return isEqual;
}

function shortenString(s) {
    s = ("" + s);
    // Remove newlines
    s = s.split('\n').join(' ');
    if (s.length > 20) {
        s = s.substring(0, 20) + '...';
    }
    return s;
}