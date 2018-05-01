import Immutable from "immutable";

export default (recurse, statement) => {
  return Immutable.Set.of(statement.getIn(["name", "identifier"]));
};
