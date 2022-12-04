const { cutString, cutStringMultiple, getOverlap } = require("./_util");

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
    }
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
    let isEqual = true;
    if (actualValue === expectedValue) {
        return true;
    }
    if ((actualValue == null) !== (expectedValue == null)) {
        isEqual = false;
    } else if (actualValue && expectedValue && actualValue.length !== expectedValue.length) {
        isEqual = false;
    } else {
        for (let i = 0; i < actualValue.length; i++) {
            if (actualValue[i] !== expectedValue[i]) {
                isEqual = false;
            }
        }
    }
    if (!isEqual) {
        expect(actualValue, expectedValue, name); // will throw
    }
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