export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const lhs = node.getIn(["lhs", "identifier"]);
  const fullRhs = recurse(node.get("rhs"), identation).full;
  const abbreviatedRhs = recurse(node.get("rhs")).abbreviated;

  return {
    abbreviated: `${ident}${lhs} = ${abbreviatedRhs}`,
    full: `${ident}${lhs} = ${fullRhs}`,
  };
};
