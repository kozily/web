export default (recurse, statement) => {
  const port = statement.getIn(["port", "identifier"]);
  return recurse(statement.get("value")).add(port);
};
