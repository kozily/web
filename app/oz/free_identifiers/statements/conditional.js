export default (recurse, statement) => {
  const conditionIdentifiers = recurse(statement.get("condition"));
  const trueStatementIdentifiers = recurse(statement.get("trueStatement"));
  const falseStatementIdentifiers = recurse(statement.get("falseStatement"));

  return conditionIdentifiers
    .union(trueStatementIdentifiers)
    .union(falseStatementIdentifiers);
};
