import { procedureApplicationStatement } from "../../machine/statements";

export default (recurse, node) => {
  const procedureCompilation = recurse(node.get("procedure"));
  const argsCompilation = node.get("args").map(x => recurse(x));

  const augmentStatement = argsCompilation.reduce(
    (f, item) => statement => f(item.augmentStatement(statement)),
    procedureCompilation.augmentStatement,
  );

  const resultingStatement = procedureApplicationStatement(
    procedureCompilation.resultingExpression,
    argsCompilation.map(x => x.resultingExpression),
  );

  return augmentStatement(resultingStatement);
};
