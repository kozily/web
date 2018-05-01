import { cellExchangeStatement } from "../../machine/statements";

export default (recurse, node) => {
  const cellCompilation = recurse(node.get("cell"));
  const current = node.get("current");
  const nextCompilation = recurse(node.get("next"));

  return cellCompilation.augmentStatement(
    nextCompilation.augmentStatement(
      cellExchangeStatement(
        cellCompilation.resultingExpression,
        current,
        nextCompilation.resultingExpression,
      ),
    ),
  );
};
