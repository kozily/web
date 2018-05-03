import { portCreationStatement } from "../../machine/statements";

export default (recurse, node) => {
  const value = node.get("value");
  const portCompilation = recurse(node.get("port"));

  return portCompilation.augmentStatement(
    portCreationStatement(value, portCompilation.resultingExpression),
  );
};
