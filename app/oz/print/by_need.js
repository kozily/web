export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const procedure = node.getIn(["procedure", "identifier"]);
  const neededIdentifier = node.getIn(["neededIdentifier", "identifier"]);
  const result = `${ident}{ByNeed ${procedure} ${neededIdentifier}}`;
  return {
    abbreviated: result,
    full: result,
  };
};