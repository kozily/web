import { exceptionRaiseStatement } from "../../machine/statements";

export default (recurse, node) => {
  const compilation = recurse(node.get("identifier"));
  return compilation.augmentStatement(
    exceptionRaiseStatement(compilation.resultingExpression),
  );
};
