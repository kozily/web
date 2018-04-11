import { exceptionContextStatement } from "../machine/statements";

export default (recurse, statement) => {
  const triedStatement = recurse(statement.get("triedStatement"));
  const exceptionStatement = recurse(statement.get("exceptionStatement"));

  return exceptionContextStatement(
    triedStatement,
    statement.get("exceptionIdentifier"),
    exceptionStatement,
  );
};
