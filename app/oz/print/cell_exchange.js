export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const cell = recurse(node.get("cell")).abbreviated;
  const current = node.getIn(["current", "identifier"]);
  const next = recurse(node.get("next")).abbreviated;
  const result = `${ident}{Exchange ${cell} ${current} ${next}}`;
  return {
    abbreviated: result,
    full: result,
  };
};
