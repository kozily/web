export default (recurse, statement) => {
  const lhsIdentifiers = recurse(statement.get("lhs"));
  const rhsIdentifiers = recurse(statement.get("rhs"));

  return lhsIdentifiers.union(rhsIdentifiers);
};
