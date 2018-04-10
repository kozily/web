import { patternMatchingStatement } from "../machine/statements";

export default (recurse, statement) => {
  const pattern = recurse(statement.get("pattern"));
  const trueStatement = recurse(statement.get("true_statement"));
  const falseStatement = recurse(statement.get("false_statement"));

  return patternMatchingStatement(
    statement.get("identifier"),
    pattern,
    trueStatement,
    falseStatement,
  );
};
