import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import {
  localStatement,
  bindingStatement,
  sequenceStatement,
  conditionalStatement,
  skipStatement,
} from "../../machine/statements";

const compileStatementAndExpression = (
  recurse,
  statement,
  expression,
  resultingExpression,
) => {
  const compiledExpression = recurse(expression, resultingExpression);

  const binding = compiledExpression.augmentStatement(
    bindingStatement(
      resultingExpression,
      compiledExpression.resultingExpression,
    ),
  );
  return statement ? sequenceStatement(recurse(statement), binding) : binding;
};

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const trueStatement = node.getIn(["trueClause", "statement"]);
  const trueExpression = node.getIn(["trueClause", "expression"]);

  const compiledTrueStatement = compileStatementAndExpression(
    recurse,
    trueStatement,
    trueExpression,
    resultingExpression,
  );

  const falseStatement = node.getIn(["falseClause", "statement"]);
  const falseExpression = node.getIn(["falseClause", "expression"]);

  const compiledFalseStatement = falseExpression
    ? compileStatementAndExpression(
        recurse,
        falseStatement,
        falseExpression,
        resultingExpression,
      )
    : skipStatement();

  const compiledCondition = recurse(node.get("condition"));

  const resultingStatement = compiledCondition.augmentStatement(
    conditionalStatement(
      compiledCondition.resultingExpression,
      compiledTrueStatement,
      compiledFalseStatement,
    ),
  );

  const augmentStatement = statement => {
    if (resultingIdentifier) {
      return resultingStatement;
    }

    return localStatement(
      auxiliaryIdentifier,
      sequenceStatement(resultingStatement, statement),
    );
  };

  return {
    resultingExpression,
    augmentStatement,
  };
};
