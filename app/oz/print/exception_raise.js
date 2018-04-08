export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const identifier = node.getIn(["identifier", "identifier"]);

  return {
    abbreviated: `${ident}raise ${identifier} end`,
    full: `${ident}raise ${identifier} end`,
  };
};
