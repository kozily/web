export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const condition = recurse(node.get("condition")).abbreviated;
  const trueStatement = recurse(node.get("trueStatement"), identation + 2);
  const falseStatement = recurse(node.get("falseStatement"), identation + 2);
  return {
    abbreviated: `${ident}if ${condition} then ... else ... end`,
    full: `${ident}if ${condition} then
${trueStatement.full}
${ident}else
${falseStatement.full}
${ident}end`,
  };
};
