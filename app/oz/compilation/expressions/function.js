import Immutable from "immutable";
import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import { procedureApplicationStatement } from "../../machine/statements";
import { makeStatementAugmentation } from "./helpers";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const functionCompilation = recurse(node.get("fun"));
  const argsCompilations = node.get("args").map(x => recurse(x));

  const argsExpressions = argsCompilations
    .map(x => x.resultingExpression)
    .push(resultingExpression);

  const resultingStatement = procedureApplicationStatement(
    functionCompilation.resultingExpression,
    argsExpressions,
  );

  const allAugmentations = Immutable.List.of(functionCompilation)
    .concat(argsCompilations)
    .map(compilation => compilation.augmentStatement);

  const augmentedResultingStatement = allAugmentations.reduce(
    (statement, f) => f(statement),
    resultingStatement,
  );

  const augmentStatement = makeStatementAugmentation(
    resultingIdentifier,
    auxiliaryIdentifier,
    augmentedResultingStatement,
  );

  return {
    resultingExpression,
    augmentStatement,
  };
};
