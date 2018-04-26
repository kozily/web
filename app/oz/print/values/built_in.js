export default (recurse, node) => {
  const operator = node.get("operator");
  const namespace = node.get("namespace");
  if (namespace === undefined) {
    return {
      abbreviated: `BuiltIn(${operator})`,
      full: `BuiltIn(${operator})`,
    };
  }
  return {
    abbreviated: `BuiltIn(${namespace}.'${operator}')`,
    full: `BuiltIn(${namespace}.'${operator}')`,
  };
};
