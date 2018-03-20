import Immutable from "immutable";

export default (recurse, statement) => {
  return Immutable.Set([
    statement.getIn(["lhs", "identifier"]),
    statement.getIn(["rhs", "identifier"]),
  ]);
};
