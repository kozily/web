import { cellCreationStatement } from "../machine/statements";

export default (recurse, node) => {
  const value = recurse(node.get("value"));
  const cell = node.get("cell");
  return cellCreationStatement(value, cell);
};
