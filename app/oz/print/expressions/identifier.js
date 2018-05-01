import printIdentifier from "../identifier";

export default (recurse, node) => {
  const identifier = printIdentifier(node.getIn(["identifier", "identifier"]));
  return {
    abbreviated: identifier,
    full: identifier,
  };
};
