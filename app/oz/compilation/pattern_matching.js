import { patternMatchingStatement } from "../machine/statements";

export default (recurse, statement) => {
  const pattern = statement.get("pattern");
  const trueStatement = recurse(statement.get("trueStatement"));
  const falseStatement = recurse(statement.get("falseStatement"));

  return patternMatchingStatement(
    statement.get("identifier"),
    pattern,
    trueStatement,
    falseStatement,
  );
};
