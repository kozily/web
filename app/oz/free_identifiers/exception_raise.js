import Immutable from "immutable";

export default (recurse, statement) => {
  return Immutable.Set([statement.getIn(["identifier", "identifier"])]);
};
