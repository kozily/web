import { cellCreationStatement } from "../../machine/statements";

export default (recurse, node) => {
  const valueCompilation = recurse(node.get("value"));
  const cell = node.get("cell");

  return valueCompilation.augmentStatement(
    cellCreationStatement(valueCompilation.resultingExpression, cell),
  );
};
