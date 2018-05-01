import printIdentifier from "../identifier";

export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const value = recurse(node.get("value")).abbreviated;
  const cell = printIdentifier(node.getIn(["cell", "identifier"]));
  const result = `${ident}{NewCell ${value} ${cell}}`;
  return {
    abbreviated: result,
    full: result,
  };
};
