import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import { cellExchangeStatement } from "../../machine/statements";
import { makeStatementAugmentation } from "../../compilation/expressions/helpers";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const lhsCompilation = recurse(node.get("lhs"));
  const rhsCompilation = recurse(node.get("rhs"));

  const resultingStatement = cellExchangeStatement(
    lhsCompilation.resultingExpression,
    resultingExpression.get("identifier"),
    rhsCompilation.resultingExpression,
  );

  const finalStatement = lhsCompilation.augmentStatement(
    rhsCompilation.augmentStatement(resultingStatement),
  );

  const augmentStatement = makeStatementAugmentation(
    resultingIdentifier,
    auxiliaryIdentifier,
    finalStatement,
  );

  return {
    resultingExpression,
    augmentStatement,
  };
};
