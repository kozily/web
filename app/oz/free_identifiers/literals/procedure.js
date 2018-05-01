export default (recurse, literal) => {
  const args = literal.getIn(["value", "args"]).map(id => id.get("identifier"));
  const bodyIdentifiers = recurse(literal.getIn(["value", "body"]));
  return bodyIdentifiers.subtract(args);
};
