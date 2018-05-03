import Immutable from "immutable";

export default (recurse, statement) => {
  const portIdentifiers = recurse(statement.get("port"));
  const value = statement.getIn(["value", "identifier"]);

  return Immutable.Set.of(value).union(portIdentifiers);
};
