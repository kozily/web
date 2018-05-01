export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const printedBody = recurse(node.get("body"), identation + 2);
  return {
    abbreviated: `${ident}thread ... end`,
    full: `${ident}thread\n${printedBody.full}\n${ident}end`,
  };
};
