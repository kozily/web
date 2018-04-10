import { conditionalStatement } from "../machine/statements";

export default (recurse, statement) => {
  const trueStatement = recurse(statement.get("true_statement"));
  const falseStatement = recurse(statement.get("false_statement"));

  return conditionalStatement(
    statement.get("condition"),
    trueStatement,
    falseStatement,
  );
};
