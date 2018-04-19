import { operatorExpression } from "../machine/expressions";

export default (recurse, node) => {
  const operator = node.get("operator");
  const compiledLhs = recurse(node.get("lhs"));
  const compiledRhs = recurse(node.get("rhs"));
  return operatorExpression(operator, compiledLhs, compiledRhs);
};
