export default (recurse, node) => {
  const name = node.get("name");
  const printed = `Name(${name})`;
  return {
    abbreviated: printed,
    full: printed,
  };
};
