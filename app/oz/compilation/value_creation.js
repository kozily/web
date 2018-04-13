import { valueCreationStatement } from "../machine/statements";

export default (recurse, node) => {
  const lhs = node.get("lhs");
  const rhs = recurse(node.get("rhs"));
  return valueCreationStatement(lhs, rhs);
};
