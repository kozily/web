export default (recurse, statement) => {
  const portIdentifiers = recurse(statement.get("port"));
  const valueIdentifiers = recurse(statement.get("value"));
  return portIdentifiers.union(valueIdentifiers);
};
