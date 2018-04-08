export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const lhs = node.getIn(["lhs", "identifier"]);
  const rhs = node.getIn(["rhs", "identifier"]);
  const result = `${ident}${lhs} = ${rhs}`;
  return {
    abbreviated: result,
    full: result,
  };
};
