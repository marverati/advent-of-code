const data1 = `kc-qy
qy-FN
kc-ZP
end-FN
li-ZP
yc-start
end-qy
yc-ZP
wx-ZP
qy-li
yc-li
yc-wx
kc-FN
FN-li
li-wx
kc-wx
ZP-start
li-kc
qy-nv
ZP-qy
nv-xr
wx-start
end-nv
kc-nv
nv-XQ`;

function prepareData(data) {
  const lines = data.split("\n").map(line => line.trim()).filter(line => line !== "");
  const nodes = {};
  for (const line of lines) {
    const [n1, n2] = line.split('-');
    let node1 = nodes[n1], node2 = nodes[n2];
    if (!node1) { nodes[n1] = node1 = createNode(n1); }
    if (!node2) { nodes[n2] = node2 = createNode(n2); }
    // Connect
    node1.connections.push(node2);
    node2.connections.push(node1);
    if (n2 > n1) {
      node1.oneWayConnections.push(node2);
    } else {
      node2.oneWayConnections.push(node1);
    }
  }
  return nodes;
}

function createNode(name) {
  const big = name === name.toUpperCase();
  return {
    name,
    connections: [],
    oneWayConnections: [],
    big,
    isInner: name !== 'start' && name !== 'end',
    x: Math.random(),
    y: Math.random(),
    vx: 0,
    vy: 0,
    weight: name === 'start' ? 999999 : (big ? 2 : 1)
  };
}

function countPaths(nodes, allowDoubleVisit) {
  return pathRecursion(nodes['start'], [], {}, doubleVisited = !allowDoubleVisit);

  function pathRecursion(node, path, visited, doubleVisited) {
    // Work on copy of visisted map and mark this node
    visited = { ... visited };
    if (!visited[node.name]) {
      visited[node.name] = true;
    }
    path = path.slice();
    path.push(node.name);
    // If end node -> end recursion
    if (node.name === 'end') {
      return [ path ];
    }
    // All neighbors
    let paths = [];
    for (const other of node.connections) {
      if (other.big || !visited[other.name] || !doubleVisited && other.isInner) {
        // Visit neighbor with appropriate doubleVisisted flag
        const doubled = (!other.big && visited[other.name]) ? true : doubleVisited;
        paths.push(...pathRecursion(other, path, visited, doubled));
      }
    }
    return paths;
  }
}

function visualizePaths(nodes, paths, canvas) {
  const nodesArray = Object.values(nodes);
  console.log(nodes, nodesArray);
  console.log(nodesArray.map(n => n.name) + " nodes");
  console.log("In total " + paths.length + " unique paths");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawFrame(ctx, nodes, nodesArray, paths, 0, 10);
}

function drawFrame(ctx, nodes, nodesArray, paths, current, batchSize) {
  if (current >= paths.length) {
    return;
  }

  // White fade
  ctx.save();
  ctx.fillStyle = "white";
  ctx.globalAlpha = 0.05;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  updatePhysics(nodesArray);

  // drawNodes(ctx, nodesArray);

  // Draw individual paths
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.strokeStyle = "black";
  ctx.globalAlpha = 0.03;
  ctx.scale(10, 10);
  ctx.lineWidth = 0.1;
  for (let off = 0; off < batchSize; off++) {
    drawPath(ctx, nodes, paths[current + off]);
  }
  ctx.restore();

  requestAnimationFrame(() => drawFrame(ctx, nodes, nodesArray, paths, current + batchSize, batchSize));
}

const preferredDistance = 30;
const friction = 0.999;

function updatePhysics(nodesArray) {
  // Update forces
  const epsilon = 0.1;
  const forceBase = 1 / (preferredDistance + epsilon);
  const forceFactor = 0.01;
  for (const node of nodesArray) {
    // Towards others
    for (const other of node.oneWayConnections) {
      const dx = other.x - node.x, dy = other.y - node.y;
      const dis = Math.sqrt(dx * dx + dy * dy);

      // Step 1: Get all distances to ~10
      let force = 0;
      if (dis < preferredDistance) {
        // Push -> positive force
        force = 1 / (dis + epsilon) - forceBase;
      } else {
        // Pull -> negative force
        force = -Math.min((dis - preferredDistance) / 10, 1);
      }
      // Apply opposite facing forces to both nodes
      const f1 = other.weight / (node.weight + other.weight), f2 = 1 - f1;
      const scaledForce = forceFactor * force / dis;
      node.vx -= f1 * scaledForce * dx;
      node.vy -= f1 * scaledForce * dy;
      other.vx += f2 * scaledForce * dx;
      other.vy += f2 * scaledForce * dy;

      // Step 2: uniform angles of connections
      // const angle = Math.atan2(dx, dy);
    }
    // Friction
    node.vx *= friction;
    node.vy *= friction;
  }
  // Update movement
  for (const node of nodesArray) {
    node.x += node.vx;
    node.y += node.vy;
  }
  // Always normalize to origin
  const start = nodesArray.find(n => n.name === 'start');
  start.x = 0;
  start.y = 0;
  start.vx = 0;
  start.vy = 0;
}

function drawNodes(ctx, nodesArray) {
  // Clear
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = ctx.strokeStyle = "black";
  ctx.fillText(+Date.now(), 5, 15);

  // Nodes
  ctx.save();
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  const scale = 5;
  for (const node of nodesArray) {
    // Name
    ctx.fillText(node.name, node.x * scale, node.y * scale);
    // Connections
    for (const other of node.oneWayConnections) {
      drawLine(ctx, node.x * scale, node.y * scale, other.x * scale, other.y * scale, 5);
    }
  }
  ctx.restore();
}

function drawLine(ctx, x1, y1, x2, y2, cut = 0) {
  ctx.beginPath();
  if (cut) {
    const dx = x2 - x1, dy = y2 - y1;
    const dis = Math.sqrt(dx * dx + dy * dy);
    x1 += cut * dx / dis;
    y1 += cut * dy / dis;
    x2 -= cut * dx / dis;
    y2 -= cut * dy / dis;
  }
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawPath(ctx, nodes, path) {
  if (!path) { return; }

  for (let i = 1; i < path.length; i++) {
    const from = nodes[path[i - 1]], to = nodes[path[i]];
    drawLine(ctx, from.x, from.y, to.x, to.y);
  }

}

const nodes = prepareData(data1);
const paths = countPaths(nodes, true);
const canvas = document.getElementById("canvas");
visualizePaths(nodes, paths, canvas);