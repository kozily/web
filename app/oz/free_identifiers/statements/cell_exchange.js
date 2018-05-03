export default (recurse, statement) => {
  const cell = recurse(statement.get("cell"));
  const current = statement.getIn(["current", "identifier"]);
  const next = recurse(statement.get("next"));
  return current === "_" ? cell.union(next) : cell.union(next).add(current);
};
