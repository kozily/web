import { exceptionRaiseStatement } from "../../machine/statements";

export default (recurse, node) => {
  const identifier = recurse(node.get("identifier"));
  return exceptionRaiseStatement(identifier);
};
