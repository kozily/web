import { cellExchangeStatement } from "../machine/statements";

export default (recurse, node) => {
  const cell = recurse(node.get("cell"));
  const current = node.get("current");
  const next = recurse(node.get("next"));
  return cellExchangeStatement(cell, current, next);
};
