import Immutable from "immutable";

export default (recurse, statement) => {
  const conditionIdentifiers = Immutable.Set([
    statement.getIn(["condition", "identifier"]),
  ]);
  const trueStatementIdentifiers = recurse(statement.get("trueStatement"));
  const falseStatementIdentifiers = recurse(statement.get("falseStatement"));

  return conditionIdentifiers
    .union(trueStatementIdentifiers)
    .union(falseStatementIdentifiers);
};
