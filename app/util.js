const connect = (...nodes) => {
  nodes.reduce((node1, node2) => {
    // if node2 has input property connect to that, otherwise connect to node2
    node1.connect(node2.input || node2);
    return node2;
  });
}

module.exports = {connect};
