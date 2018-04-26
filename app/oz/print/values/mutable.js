export default (recurse, node) => {
  const kind = node.get("kind");
  const sequence = node.get("sequence");
  const printed = `MutableRef(${kind}${sequence})`;
  return {
    abbreviated: printed,
    full: printed,
  };
};
