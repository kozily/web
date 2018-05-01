export default (recurse, statement) => {
  const declaredIdentifiers = statement.getIn(["identifier", "identifier"]);
  const statementIdentifiers = recurse(statement.get("statement"));
  return statementIdentifiers.subtract([declaredIdentifiers]);
};
