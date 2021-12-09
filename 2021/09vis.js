
console.log("Map size: ", map.w, "x", map.h);

const cnv = document.createElement("canvas");
const ctx = cnv.getContext("2d");

const cw = 1600, ch = 800;
cnv.width = cw;
cnv.height = ch;

let viewRotation = 0, viewSin = 0, viewCos = 0;
setViewAngle(Math.PI / 4);
const viewScale = 12;
const viewExtrudeFactor = 0.3;
const viewFlatten = 0.3;
const sunAngle = [1.3, 0.5, 1];

console.log(getNormal(1, 0, 0, 0, 2, 0));

drawFrame();

document.body.appendChild(cnv);
console.log(cnv);



document.body.addEventListener("mousemove", (e) => {
    sunAngle[0] = (e.clientX - cw / 2) / (cw / 4);
    sunAngle[1] = (e.clientY - ch / 2) / (ch / 4);
    draw();
});

function drawFrame() {
    setViewAngle(Date.now() * 0.0001);
    draw();

    requestAnimationFrame(drawFrame);
}

function setViewAngle(a) {
    viewRotation = a;
    viewSin = Math.sin(a);
    viewCos = Math.cos(a);
}

function draw() {
    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cw, ch);

    // Camera
    ctx.save();
    ctx.translate(cw / 2, ch * 0.5);
    ctx.scale(viewScale, viewScale);

    // Render map
    const xm = map.w / 2, ym = map.h / 2;
    // ctx.shadowBlur = 2;
    for (let y = 0; y < map.h - 1; y++) {
        for (let x = 0; x < map.w - 1; x++) {
            const c = map.get(x, y) * 255 / 9;
            // ctx.fillStyle = `rgb(${c}, ${c}, ${c})`;
            // ctx.fillRect(x - xm, y - ym, 1, 1);
            drawRect3D(x - xm, y - ym, map.get(x, y), x - xm + 1, y - ym, map.get(x + 1, y), x - xm, y - ym + 1, map.get(x, y + 1)); // top left half
            drawRect3D(x - xm + 1, y - ym, map.get(x + 1, y), x - xm + 1, y - ym+ 1, map.get(x + 1, y + 1), x - xm, y - ym + 1, map.get(x, y + 1)); // bottom right half
        }
    }

    ctx.restore();
}

function drawRect3D(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    const [sx1, sy1] = transform(x1, y1, z1);
    const [sx2, sy2] = transform(x2, y2, z2);
    const [sx3, sy3] = transform(x3, y3, z3);
    const normal = getNormal(x2 - x1, y2 - y1, z2 - z1, x3 - x1, y3 - y1, z3 - z1);
    const light = getLight(normal, sunAngle);
    ctx.fillStyle = getColor((z1 + z2 + z3) / 3 / 9, light);
    ctx.shadowColor = ctx.fillStyle;
    drawRect2D(sx1, sy1, sx2, sy2, sx3, sy3);
}

function drawRect2D(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
}

function transform(x, y, z) {
    // rotate
    const rx = viewCos * x - viewSin * y;
    const ry = viewSin * x + viewCos * y;
    // flatten & extrude
    return [ rx, ry * viewFlatten - viewExtrudeFactor * z ];
}

function getNormal(x1, y1, z1, x2, y2, z2) {
    const cross = [
        y1 * z2 - y2 * z1,
        z1 * x2 - z2 * x1,
        x1 * y2 - x2 * y1,
    ];
    return cross;
}

function getLight(normal, sun) {
    normal = normalize(normal);
    sun = normalize(sun);
    const dot = normal[0] * sun[0] + normal[1] * sun[1] + normal[2] * sun[2];
    const lightness = 0.5 + 0.5 * dot;
    return lightness;
}

function getColor(h, light) {
    const r = 255 * h * h, b = 255 * Math.sqrt(h), g = 255 * h * h * h;
    return `rgb(${r * light}, ${g * light}, ${b * light})`;
}

function normalize(vec) {
    const [x, y, z] = vec;
    const len = Math.sqrt(x * x + y * y + z * z);
    return [ x / len, y / len, z / len ];
}