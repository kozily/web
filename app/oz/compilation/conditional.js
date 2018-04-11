import { conditionalStatement } from "../machine/statements";

export default (recurse, statement) => {
  const trueStatement = recurse(statement.get("trueStatement"));
  const falseStatement = recurse(statement.get("falseStatement"));

  return conditionalStatement(
    statement.get("condition"),
    trueStatement,
    falseStatement,
  );
};
