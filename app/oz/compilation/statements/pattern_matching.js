import {
  patternMatchingStatement,
  skipStatement,
} from "../../machine/statements";

export default (recurse, statement) => {
  const identifier = statement.get("identifier");
  const falseStatement = statement.get("falseStatement");
  const finalFalseStatement = falseStatement
    ? recurse(statement.get("falseStatement"))
    : skipStatement();

  return statement.get("clauses").reduceRight((result, clause) => {
    return patternMatchingStatement(
      identifier,
      clause.get("pattern"),
      recurse(clause.get("statement")),
      result,
    );
  }, finalFalseStatement);
};
