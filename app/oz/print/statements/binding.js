export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const lhs = node.get("lhs");
  const fullLhs = recurse(lhs, identation).full;
  const abbreviatedLhs = recurse(lhs).abbreviated;
  const rhs = node.get("rhs");
  const fullRhs = recurse(rhs, identation).full;
  const abbreviatedRhs = recurse(rhs).abbreviated;

  return {
    abbreviated: `${ident}${abbreviatedLhs} = ${abbreviatedRhs}`,
    full: `${ident}${fullLhs} = ${fullRhs}`,
  };
};
