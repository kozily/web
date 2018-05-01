import { operatorExpression } from "../../machine/expressions";

export default (recurse, node) => {
  const operator = node.get("operator");
  const compiledLhs = recurse(node.get("lhs"));
  const compiledRhs = recurse(node.get("rhs"));

  const resultingExpression = operatorExpression(
    operator,
    compiledLhs.resultingExpression,
    compiledRhs.resultingExpression,
  );

  const augmentStatement = statement =>
    compiledLhs.augmentStatement(compiledRhs.augmentStatement(statement));

  return {
    resultingExpression,
    augmentStatement,
  };
};
