import { localStatement } from "../machine/statements";

export default (recurse, statement) => {
  return localStatement(
    statement.get("identifier"),
    recurse(statement.get("statement")),
  );
};
