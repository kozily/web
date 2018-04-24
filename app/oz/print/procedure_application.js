export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const procedureIdentifier = recurse(node.get("procedure")).abbreviated;
  const args = node
    .get("args")
    .map(x => recurse(x).abbreviated)
    .join(" ");
  const result = `${ident}{${procedureIdentifier} ${args}}`;
  return {
    abbreviated: result,
    full: result,
  };
};
