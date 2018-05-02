import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import { exceptionContextStatement } from "../../machine/statements";
import {
  compileStatementAndExpression,
  makeStatementAugmentation,
} from "./helpers";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const compiledTryStatement = compileStatementAndExpression(
    recurse,
    node.get("tryClause"),
    resultingExpression,
  );

  const compiledExceptionStatement = compileStatementAndExpression(
    recurse,
    node.get("exceptionClause"),
    resultingExpression,
  );

  const resultingStatement = exceptionContextStatement(
    compiledTryStatement,
    node.get("exceptionIdentifier"),
    compiledExceptionStatement,
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
