export default (recurse, node) => {
  return recurse(node.get("literal"));
};
