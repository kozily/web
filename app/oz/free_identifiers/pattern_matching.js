import Immutable from "immutable";

export default (recurse, statement) => {
  const caseIdentifier = Immutable.Set([
    statement.getIn(["identifier", "identifier"]),
  ]);

  const patternIdentifiers = recurse(statement.get("pattern"));
  const trueStatementRawIdentifiers = recurse(statement.get("true_statement"));
  const trueStatementIdentifiers = trueStatementRawIdentifiers.subtract(
    patternIdentifiers,
  );

  const falseStatementIdentifiers = recurse(statement.get("false_statement"));

  return caseIdentifier
    .union(falseStatementIdentifiers)
    .union(trueStatementIdentifiers);
};
