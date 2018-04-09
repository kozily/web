export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const procedureIdentifier = node.getIn(["procedure", "identifier"]);
  const args = node
    .get("args")
    .map(x => x.get("identifier"))
    .join(" ");
  const result = `${ident}{${procedureIdentifier} ${args}}`;
  return {
    abbreviated: result,
    full: result,
  };
};
