export default (recurse, statement) => {
  const headIdentifiers = recurse(statement.get("head"));
  const tailIdentifiers = recurse(statement.get("tail"));

  return headIdentifiers.union(tailIdentifiers);
};
