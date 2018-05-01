import { threadStatement } from "../../machine/statements";

export default (recurse, node) => {
  const innerStatement = recurse(node.get("body"));
  return threadStatement(innerStatement);
};
