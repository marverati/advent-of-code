
const { data0, data1 } = require('./20data');
const Array2D = require('./dataStructures/Array2D');

function prepareData(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line !== "");
    const enhancement = lines[0].split("").map(v => v === "#" ? 1 : 0);
    const h = lines.length - 1, w = lines[2].length;
    const pixels = new Array2D(w, h, (x, y) => lines[y + 1][x] === "#" ? 1 : 0);
    return { pixels, enhancement };
}

function enhanceImage({ pixels, enhancement }, numSteps) {
    for (let i = 0; i < numSteps; i++) {
        pixels = enhance(pixels, enhancement);
    }
    return getLightPixelCount(pixels);
}

function getLightPixelCount(map) {
    return map.reduceCells((count, p) => count + (p ? 1 : 0), 0);
}

let flipDefaultValue = 1;

function enhance(img, enhancement) {
    flipDefaultValue = flipDefaultValue ? 0 : 1;
    return new Array2D(img.w + 2, img.h + 2, (x, y) => {
        // source center is x - 1, y - 1 in old image; so take data from x - 2 to x
        const index = 
            get(x - 2, y - 2) << 8 |
            get(x - 1, y - 2) << 7 |
            get(x    , y - 2) << 6 |
            get(x - 2, y - 1) << 5 |
            get(x - 1, y - 1) << 4 |
            get(x    , y - 1) << 3 |
            get(x - 2, y    ) << 2 |
            get(x - 1, y    ) << 1 |
            get(x    , y    )
        return enhancement[index];
    });

    function get(x, y) {
        return (img[y] && img[y][x] != null) ? img[y][x] : flipDefaultValue;
    }
}

const data = prepareData(data1);
console.log("Part 1: ", enhanceImage(data, 2));
console.log("Part 2: ", enhanceImage(data, 50));