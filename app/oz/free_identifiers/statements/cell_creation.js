export default (recurse, statement) => {
  const cell = statement.getIn(["cell", "identifier"]);
  return recurse(statement.get("value")).add(cell);
};
