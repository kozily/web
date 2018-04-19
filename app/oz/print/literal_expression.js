export default (recurse, node, identation) => {
  return recurse(node.get("literal"), identation);
};
