import { cellCreationStatement } from "../../machine/statements";

export default (recurse, node) => {
  const valueCompilation = recurse(node.get("value"));
  const cellCompilation = recurse(node.get("cell"));

  return valueCompilation.augmentStatement(
    cellCompilation.augmentStatement(
      cellCreationStatement(
        valueCompilation.resultingExpression,
        cellCompilation.resultingExpression,
      ),
    ),
  );
};
