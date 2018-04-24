import { byNeedStatement } from "../machine/statements";

export default (recurse, node) => {
  const procedure = recurse(node.get("procedure"));
  const neededIdentifier = node.get("neededIdentifier");
  return byNeedStatement(procedure, neededIdentifier);
};
