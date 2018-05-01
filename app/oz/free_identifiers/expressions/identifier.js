import Immutable from "immutable";

export default (recurse, node) => {
  return Immutable.Set([node.getIn(["identifier", "identifier"])]);
};
