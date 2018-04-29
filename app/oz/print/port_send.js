export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const value = recurse(node.get("value")).abbreviated;
  const port = recurse(node.get("port")).abbreviated;
  const result = `${ident}{Send ${port} ${value}}`;
  return {
    abbreviated: result,
    full: result,
  };
};
