export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const procedure = recurse(node.get("procedure")).abbreviated;
  const neededIdentifier = recurse(node.get("neededIdentifier")).abbreviated;
  const result = `${ident}{ByNeed ${procedure} ${neededIdentifier}}`;
  return {
    abbreviated: result,
    full: result,
  };
};
