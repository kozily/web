const printIdentifier = node => {
  if (node.getIn(["procedure", "node"]) === "recordSelection") {
    const procedureIdentifier = node.getIn(["procedure", "identifier"]);
    const procedureFeature = node.getIn([
      "procedure",
      "feature",
      "value",
      "label",
    ]);
    return `${procedureIdentifier}.'${procedureFeature}'`;
  }

  return node.getIn(["procedure", "identifier"]);
};

export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const procedureIdentifier = printIdentifier(node);
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
