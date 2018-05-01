import { literalExpression } from "../../machine/expressions";

export default (recurse, node) => {
  const compiledLiteral = recurse(node.get("literal"));
  return {
    resultingExpression: literalExpression(compiledLiteral),
    augmentStatement: statement => statement,
  };
};
