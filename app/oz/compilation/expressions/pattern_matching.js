import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import {
  localStatement,
  bindingStatement,
  sequenceStatement,
  patternMatchingStatement,
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

  const falseStatement = node.getIn(["falseClause", "statement"]);
  const falseExpression = node.getIn(["falseClause", "expression"]);

  const compiledFinalFalseStatement = falseExpression
    ? compileStatementAndExpression(
        recurse,
        falseStatement,
        falseExpression,
        resultingExpression,
      )
    : skipStatement();

  const expressionCompilation = recurse(node.get("identifier"));

  const rawResultingStatement = node
    .get("clauses")
    .reduceRight((result, clause) => {
      const compiledClause = compileStatementAndExpression(
        recurse,
        clause.get("statement"),
        clause.get("expression"),
        resultingExpression,
      );
      return patternMatchingStatement(
        expressionCompilation.resultingExpression,
        clause.get("pattern"),
        compiledClause,
        result,
      );
    }, compiledFinalFalseStatement);

  const resultingStatement = expressionCompilation.augmentStatement(
    rawResultingStatement,
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
