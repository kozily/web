import { exceptionCatchStatement } from "../../machine/statements";

export default (recurse, statement) => {
  const exceptionStatement = recurse(statement.get("exceptionStatement"));

  return exceptionCatchStatement(
    statement.get("exceptionIdentifier"),
    exceptionStatement,
  );
};
