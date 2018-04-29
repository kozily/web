import { nameCreationStatement } from "../machine/statements";

export default (recurse, node) => {
  const keyIdentifier = node.get("name");
  return nameCreationStatement(keyIdentifier);
};
