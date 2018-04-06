import Immutable from "immutable";

export default (recurse, statement) => {
  const exceptionIdentifier = Immutable.Set([
    statement.getIn(["exceptionIdentifier", "identifier"]),
  ]);

  const exceptionStatementIdentifiers = recurse(
    statement.get("exceptionStatement"),
  );

  return exceptionStatementIdentifiers.subtract(exceptionIdentifier);
};
