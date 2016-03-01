// Helper for creating an AudioNode-like object, for use with with `connect`
const node = (input, output) => ({
  input: input,
  connect: (node) => output.connect(node)
})

// Connect `nodes` together in a chain. Can be AudioNode or AudioNode-like
const connect = (...nodes) => {
  nodes.reduce((node1, node2) => {
    node1.connect(node2 instanceof AudioNode ? node2 : node2.input);
    return node2;
  });
}

module.exports = {connect, node};
