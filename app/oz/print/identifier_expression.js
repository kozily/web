export default (recurse, node) => {
  const identifier = node.getIn(["identifier", "identifier"]);
  return {
    abbreviated: identifier,
    full: identifier,
  };
};
