import { byNeedStatement } from "../../machine/statements";

export default (recurse, node) => {
  const procedureCompilation = recurse(node.get("procedure"));
  const neededIdentifier = node.get("neededIdentifier");
  return procedureCompilation.augmentStatement(
    byNeedStatement(procedureCompilation.resultingExpression, neededIdentifier),
  );
};
