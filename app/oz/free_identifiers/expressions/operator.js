export default (recurse, node) => {
  const lhsIdentifiers = recurse(node.get("lhs"));
  const rhsIdentifiers = recurse(node.get("rhs"));

  return lhsIdentifiers.union(rhsIdentifiers);
};
