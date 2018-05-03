import { nameCreationStatement } from "../../machine/statements";

export default (recurse, node) => {
  const nameCompilation = recurse(node.get("name"));
  return nameCompilation.augmentStatement(
    nameCreationStatement(nameCompilation.resultingExpression),
  );
};
