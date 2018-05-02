import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import {
  localStatement,
  bindingStatement,
  sequenceStatement,
  threadStatement,
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

  const innerStatement = node.get("statement");
  const innerExpression = node.get("expression");

  const compiledThreadStatement = compileStatementAndExpression(
    recurse,
    innerStatement,
    innerExpression,
    resultingExpression,
  );

  const resultingStatement = threadStatement(compiledThreadStatement);

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
