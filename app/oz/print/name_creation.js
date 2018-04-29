export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const name = node.getIn(["name", "identifier"]);
  const result = `${ident}{NewName ${name}}`;
  return {
    abbreviated: result,
    full: result,
  };
};
