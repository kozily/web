export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const conditionIdentifier = node.getIn(["condition", "identifier"]);
  const trueStatement = recurse(node.get("trueStatement"), identation + 2);
  const falseStatement = recurse(node.get("falseStatement"), identation + 2);
  return {
    abbreviated: `${ident}if ${conditionIdentifier} then ... else ... end`,
    full: `${ident}if ${conditionIdentifier} then
${trueStatement.full}
${ident}else
${falseStatement.full}
${ident}end`,
  };
};
