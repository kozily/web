import { cellExchangeStatement } from "../../machine/statements";
import { lexicalIdentifier } from "../../machine/lexical";

export default (recurse, node) => {
  const lhsCompilation = recurse(node.get("lhs"));
  const rhsCompilation = recurse(node.get("rhs"));

  return lhsCompilation.augmentStatement(
    rhsCompilation.augmentStatement(
      cellExchangeStatement(
        lhsCompilation.resultingExpression,
        lexicalIdentifier("_"),
        rhsCompilation.resultingExpression,
      ),
    ),
  );
};
