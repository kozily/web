export default (recurse, node) => {
  const operator = node.get("operator");
  const namespace = node.get("namespace");
  return {
    abbreviated: `BuiltIn(${namespace}.'${operator}')`,
    full: `BuiltIn(${namespace}.'${operator}')`,
  };
};
