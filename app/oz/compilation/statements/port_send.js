import { portSendStatement } from "../../machine/statements";

export default (recurse, node) => {
  const port = recurse(node.get("port"));
  const value = recurse(node.get("value"));

  return port.augmentStatement(
    value.augmentStatement(
      portSendStatement(port.resultingExpression, value.resultingExpression),
    ),
  );
};
