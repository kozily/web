export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const identifier = recurse(node.get("identifier")).abbreviated;
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
