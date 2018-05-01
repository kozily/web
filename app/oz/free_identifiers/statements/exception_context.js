import Immutable from "immutable";

export default (recurse, statement) => {
  const exceptionIdentifier = Immutable.Set([
    statement.getIn(["exceptionIdentifier", "identifier"]),
  ]);

  const triedStatementIdentifiers = recurse(statement.get("triedStatement"));
  const exceptionStatementIdentifiers = recurse(
    statement.get("exceptionStatement"),
  );

  return triedStatementIdentifiers.union(
    exceptionStatementIdentifiers.subtract(exceptionIdentifier),
  );
};
