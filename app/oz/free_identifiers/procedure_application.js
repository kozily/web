import Immutable from "immutable";

export default (recurse, statement) => {
  const procedureIdentifier = Immutable.Set([
    statement.getIn(["procedure", "identifier"]),
  ]);

  const argumentIdentifiers = Immutable.Set(
    statement.get("args").map(x => x.get("identifier")),
  );

  return procedureIdentifier.union(argumentIdentifiers);
};
