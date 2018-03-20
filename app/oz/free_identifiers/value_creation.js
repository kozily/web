import Immutable from "immutable";

export default (recurse, statement) => {
  const lhsIdentifier = Immutable.Set([statement.getIn(["lhs", "identifier"])]);
  const rhsIdentifiers = recurse(statement.get("rhs"));

  return lhsIdentifier.union(rhsIdentifiers);
};
