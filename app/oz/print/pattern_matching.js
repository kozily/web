export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const identifier = node.getIn(["identifier", "identifier"]);
  const printedPattern = recurse(node.get("pattern")).abbreviated;
  const printedMatchStatement = recurse(
    node.get("trueStatement"),
    identation + 2,
  ).full;
  const printedFailStatement = recurse(
    node.get("falseStatement"),
    identation + 2,
  ).full;

  return {
    abbreviated: `${ident}case ${identifier} of ${printedPattern} then ... end`,
    full: `${ident}case ${identifier} of ${printedPattern} then\n${printedMatchStatement}\n${ident}else\n${printedFailStatement}\n${ident}end`,
  };
};
