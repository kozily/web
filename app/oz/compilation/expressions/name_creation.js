import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import { nameCreationStatement } from "../../machine/statements";
import { makeStatementAugmentation } from "./helpers";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const resultingStatement = nameCreationStatement(resultingExpression);

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
