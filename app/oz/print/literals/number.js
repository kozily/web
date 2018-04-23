export default (recurse, node) => {
  const value = node.get("value");
  const result = `${value}`;
  return {
    abbreviated: result,
    full: result,
  };
};
