import Immutable from "immutable";

export default (recurse, statement) => {
  const procedureIdentifiers = recurse(statement.get("procedure"));

  const argumentIdentifiers = statement
    .get("args")
    .reduce((result, item) => result.union(recurse(item)), Immutable.Set());

  return procedureIdentifiers.union(argumentIdentifiers);
};
