import { statementTypes } from "../machine/statements";

export default (recurse, node) => {
  return node.set("type", statementTypes.skip);
};
