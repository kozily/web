import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import {
  localStatement,
  bindingStatement,
  sequenceStatement,
  exceptionContextStatement,
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

  const tryStatement = node.getIn(["tryClause", "statement"]);
  const tryExpression = node.getIn(["tryClause", "expression"]);

  const compiledTryStatement = compileStatementAndExpression(
    recurse,
    tryStatement,
    tryExpression,
    resultingExpression,
  );

  const exceptionStatement = node.getIn(["exceptionClause", "statement"]);
  const exceptionExpression = node.getIn(["exceptionClause", "expression"]);

  const compiledExceptionStatement = exceptionExpression
    ? compileStatementAndExpression(
        recurse,
        exceptionStatement,
        exceptionExpression,
        resultingExpression,
      )
    : skipStatement();

  const resultingStatement = exceptionContextStatement(
    compiledTryStatement,
    node.get("exceptionIdentifier"),
    compiledExceptionStatement,
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
