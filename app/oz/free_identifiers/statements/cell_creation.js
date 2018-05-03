export default (recurse, statement) => {
  const cellIdentifiers = recurse(statement.get("cell"));
  const valueIdentifiers = recurse(statement.get("value"));

  return cellIdentifiers.union(valueIdentifiers);
};
