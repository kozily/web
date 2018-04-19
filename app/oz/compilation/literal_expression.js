import { literalExpression } from "../machine/expressions";

export default (recurse, node) => {
  const compiledLiteral = recurse(node.get("literal"));
  return literalExpression(compiledLiteral);
};
