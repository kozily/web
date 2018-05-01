import Immutable from "immutable";

export default (recurse, statement) => {
  const port = statement.getIn(["port", "identifier"]);
  const value = statement.getIn(["value", "identifier"]);

  return Immutable.Set.of(port, value);
};
