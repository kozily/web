export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const result = `${ident}skip`;
  return {
    abbreviated: result,
    full: result,
  };
};
