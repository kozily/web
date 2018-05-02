import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import {
  cellExchangeStatement,
  localStatement,
  sequenceStatement,
} from "../../machine/statements";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const atCellCompilation = recurse(node.get("cell"));

  const augmentStatement = statement => {
    const exchangeStatement = cellExchangeStatement(
      atCellCompilation.resultingExpression,
      resultingExpression.get("identifier"),
      resultingExpression,
    );

    const augmentStatement = statement =>
      atCellCompilation.augmentStatement(statement);

    if (resultingIdentifier) {
      return augmentStatement(exchangeStatement);
    }

    return augmentStatement(
      localStatement(
        auxiliaryIdentifier,
        sequenceStatement(exchangeStatement, statement),
      ),
    );
  };

  return {
    resultingExpression,
    augmentStatement,
  };
};
