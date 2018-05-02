import {
  localStatement,
  bindingStatement,
  sequenceStatement,
  skipStatement,
} from "../../machine/statements";

export const compileStatementAndExpression = (
  recurse,
  clause,
  resultingExpression,
) => {
  if (!clause) {
    return skipStatement();
  }

  const expression = clause.get("expression");
  const statement = clause.get("statement");

  const compiledExpression = recurse(expression, resultingExpression);

  const binding = compiledExpression.augmentStatement(
    bindingStatement(
      resultingExpression,
      compiledExpression.resultingExpression,
    ),
  );
  return statement ? sequenceStatement(recurse(statement), binding) : binding;
};

export const makeStatementAugmentation = (
  resultingIdentifier,
  auxiliaryIdentifier,
  resultingStatement,
) => {
  if (resultingIdentifier) {
    return () => resultingStatement;
  }

  return statement =>
    localStatement(
      auxiliaryIdentifier,
      sequenceStatement(resultingStatement, statement),
    );
};
