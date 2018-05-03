import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import { cellExchangeStatement } from "../../machine/statements";
import { makeStatementAugmentation } from "./helpers";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const atCellCompilation = recurse(node.get("cell"));

  const resultingStatement = cellExchangeStatement(
    atCellCompilation.resultingExpression,
    resultingExpression.get("identifier"),
    resultingExpression,
  );

  const finalStatement = atCellCompilation.augmentStatement(resultingStatement);

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
