export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const lhs = node.getIn(["lhs", "identifier"]);
  const rhs = node.get("rhs");
  const fullRhs = recurse(rhs, identation).full;
  const abbreviatedRhs = recurse(rhs).abbreviated;

  return {
    abbreviated: `${ident}${lhs} = ${abbreviatedRhs}`,
    full: `${ident}${lhs} = ${fullRhs}`,
  };
};
