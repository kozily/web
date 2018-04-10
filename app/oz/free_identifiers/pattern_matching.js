import Immutable from "immutable";

export default (recurse, statement) => {
  const caseIdentifier = Immutable.Set([
    statement.getIn(["identifier", "identifier"]),
  ]);

  const patternIdentifiers = recurse(statement.get("pattern"));
  const trueStatementIdentifiers = recurse(statement.get("trueStatement"));

  const falseStatementIdentifiers = recurse(statement.get("falseStatement"));

  return caseIdentifier
    .union(falseStatementIdentifiers)
    .union(trueStatementIdentifiers.subtract(patternIdentifiers));
};
