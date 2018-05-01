import { sequenceStatement } from "../../machine/statements";

export default (recurse, statement) => {
  const head = recurse(statement.get("head"));
  const tail = recurse(statement.get("tail"));

  return sequenceStatement(head, tail);
};
