import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import { cellCreationStatement } from "../../machine/statements";
import { makeStatementAugmentation } from "./helpers";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const valueCompilation = recurse(node.get("value"));

  const resultingStatement = valueCompilation.augmentStatement(
    cellCreationStatement(
      valueCompilation.resultingExpression,
      resultingExpression,
    ),
  );

  const augmentStatement = makeStatementAugmentation(
    resultingIdentifier,
    auxiliaryIdentifier,
    resultingStatement,
  );

  return {
    resultingExpression,
    augmentStatement,
  };
};
