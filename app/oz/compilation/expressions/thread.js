import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import { threadStatement } from "../../machine/statements";
import {
  compileStatementAndExpression,
  makeStatementAugmentation,
} from "./helpers";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const compiledThreadStatement = compileStatementAndExpression(
    recurse,
    node,
    resultingExpression,
  );

  const resultingStatement = threadStatement(compiledThreadStatement);

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
