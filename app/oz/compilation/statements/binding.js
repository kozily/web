import { bindingStatement } from "../../machine/statements";
import { isBindable } from "../../machine/expressions";

export default (recurse, node) => {
  const lhs = isBindable(node.get("rhs"))
    ? recurse(node.get("lhs"), node.get("rhs"))
    : recurse(node.get("lhs"));

  const rhs = isBindable(node.get("lhs"))
    ? recurse(node.get("rhs"), node.get("lhs"))
    : recurse(node.get("rhs"));

  const compiledStatement = bindingStatement(
    lhs.resultingExpression,
    rhs.resultingExpression,
  );
  return lhs.augmentStatement(rhs.augmentStatement(compiledStatement));
};
