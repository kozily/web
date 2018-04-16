export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const operator = node.get("operator");
  const namespace = node.get("namespace");
  return {
    abbreviated: `${ident}BuiltIn(${namespace}.'${operator}')`,
    full: `${ident}BuiltIn(${namespace}.'${operator}')`,
  };
};
