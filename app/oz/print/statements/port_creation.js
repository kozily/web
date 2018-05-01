import printIdentifier from "../identifier";

export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const value = printIdentifier(node.getIn(["value", "identifier"]));
  const port = printIdentifier(node.getIn(["port", "identifier"]));
  const result = `${ident}{NewPort ${value} ${port}}`;
  return {
    abbreviated: result,
    full: result,
  };
};
