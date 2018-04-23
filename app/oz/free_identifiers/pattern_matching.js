export default (recurse, statement) => {
  const caseIdentifiers = recurse(statement.get("identifier"));
  const patternIdentifiers = recurse(statement.get("pattern"));
  const trueStatementIdentifiers = recurse(statement.get("trueStatement"));

  const falseStatementIdentifiers = recurse(statement.get("falseStatement"));

  return caseIdentifiers
    .union(falseStatementIdentifiers)
    .union(trueStatementIdentifiers.subtract(patternIdentifiers));
};
