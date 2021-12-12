const data0 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

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
  }
  return nodes;
}

function createNode(name) {
  return {
    name,
    connections: [],
    big: name === name.toUpperCase(),
    isInner: name !== 'start' && name !== 'end'
  };
}

function countPaths(nodes, allowDoubleVisit) {
  return pathRecursion(nodes['start'], 0, {}, doubleVisited = !allowDoubleVisit);

  function pathRecursion(node, depth, visited, doubleVisited) {
    // Work on copy of visisted map and mark this node
    visited = { ... visited };
    if (!visited[node.name]) {
      visited[node.name] = true;
    }
    // If end node -> end recursion
    if (node.name === 'end') {
      return 1;
    }
    // All neighbors
    let paths = 0;
    for (const other of node.connections) {
      if (other.big || !visited[other.name] || !doubleVisited && other.isInner) {
        // Visit neighbor with appropriate doubleVisisted flag
        const doubled = (!other.big && visited[other.name]) ? true : doubleVisited;
        paths += pathRecursion(other, depth + 1, visited, doubled);
      }
    }
    return paths;
  }
}

const data = prepareData(data1);
console.log("Part 1: ", countPaths(data, false));
console.log("Part 2: ", countPaths(data, true));