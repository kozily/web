import Immutable from "immutable";

export default (recurse, args) => {
  const lhs = args.getIn([0, "value"]);
  const rhs = args.getIn([1, "value"]);
  const value = Immutable.is(lhs, rhs);
  return Immutable.Map({ value });
};
