import Immutable from "immutable";

export default (recurse, statement) => {
  return Immutable.Set([
    statement.getIn(["procedure", "identifier"]),
    statement.getIn(["neededIdentifier", "identifier"]),
  ]);
};
