import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import { patternMatchingStatement } from "../../machine/statements";
import {
  compileStatementAndExpression,
  makeStatementAugmentation,
} from "./helpers";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const compiledFalseStatement = compileStatementAndExpression(
    recurse,
    node.get("falseClause"),
    resultingExpression,
  );

  const expressionCompilation = recurse(node.get("identifier"));

  const rawResultingStatement = node
    .get("clauses")
    .reduceRight((result, clause) => {
      const compiledClause = compileStatementAndExpression(
        recurse,
        clause,
        resultingExpression,
      );
      return patternMatchingStatement(
        expressionCompilation.resultingExpression,
        clause.get("pattern"),
        compiledClause,
        result,
      );
    }, compiledFalseStatement);

  const resultingStatement = expressionCompilation.augmentStatement(
    rawResultingStatement,
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
