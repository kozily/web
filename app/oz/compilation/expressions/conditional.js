import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import { conditionalStatement } from "../../machine/statements";
import {
  compileStatementAndExpression,
  makeStatementAugmentation,
} from "./helpers";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const compiledTrueStatement = compileStatementAndExpression(
    recurse,
    node.get("trueClause"),
    resultingExpression,
  );

  const compiledFalseStatement = compileStatementAndExpression(
    recurse,
    node.get("falseClause"),
    resultingExpression,
  );

  const compiledCondition = recurse(node.get("condition"));

  const resultingStatement = compiledCondition.augmentStatement(
    conditionalStatement(
      compiledCondition.resultingExpression,
      compiledTrueStatement,
      compiledFalseStatement,
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
