import { bindingStatement } from "../machine/statements";

export default (recurse, node) => {
  const lhs = recurse(node.get("lhs"));
  const rhs = recurse(node.get("rhs"));
  return bindingStatement(lhs, rhs);
};
