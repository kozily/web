import {
  patternMatchingStatement,
  skipStatement,
} from "../../machine/statements";

export default (recurse, statement) => {
  const expressionCompilation = recurse(statement.get("identifier"));
  const falseStatement = statement.get("falseStatement");
  const finalFalseStatement = falseStatement
    ? recurse(statement.get("falseStatement"))
    : skipStatement();

  const resultingStatement = statement
    .get("clauses")
    .reduceRight((result, clause) => {
      return patternMatchingStatement(
        expressionCompilation.resultingExpression,
        clause.get("pattern"),
        recurse(clause.get("statement")),
        result,
      );
    }, finalFalseStatement);

  return expressionCompilation.augmentStatement(resultingStatement);
};
