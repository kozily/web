import { conditionalStatement, skipStatement } from "../../machine/statements";

export default (recurse, statement) => {
  const compiledTrueStatement = recurse(statement.get("trueStatement"));

  const falseStatement = statement.get("falseStatement");
  const compiledFalseStatement = falseStatement
    ? recurse(falseStatement)
    : skipStatement();

  return conditionalStatement(
    statement.get("condition"),
    compiledTrueStatement,
    compiledFalseStatement,
  );
};
