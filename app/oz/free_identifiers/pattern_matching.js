import Immutable from "immutable";

export default (recurse, statement) => {
  const caseIdentifier = Immutable.Set([
    statement.getIn(["identifier", "identifier"]),
  ]);

  const patternIdentifiers = recurse(statement.get("pattern"));
  const trueStatementIdentifiers = recurse(statement.get("true_statement"));

  const falseStatementIdentifiers = recurse(statement.get("false_statement"));

  return caseIdentifier
    .union(falseStatementIdentifiers)
    .union(trueStatementIdentifiers.subtract(patternIdentifiers));
};
