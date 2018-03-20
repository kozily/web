import Immutable from "immutable";

export default (recurse, statement) => {
  const conditionIdentifiers = Immutable.Set([
    statement.getIn(["condition", "identifier"]),
  ]);
  const trueStatementIdentifiers = recurse(statement.get("true_statement"));
  const falseStatementIdentifiers = recurse(statement.get("false_statement"));

  return conditionIdentifiers
    .union(trueStatementIdentifiers)
    .union(falseStatementIdentifiers);
};
