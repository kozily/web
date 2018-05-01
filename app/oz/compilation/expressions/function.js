import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import {
  procedureApplicationStatement,
  localStatement,
  sequenceStatement,
} from "../../machine/statements";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const functionCompilation = recurse(node.get("fun"));
  const argsCompilations = node.get("args").map(x => recurse(x));

  const augmentStatement = statement => {
    const procedureApplication = procedureApplicationStatement(
      functionCompilation.resultingExpression,
      argsCompilations
        .map(x => x.resultingExpression)
        .push(resultingExpression),
    );

    const augmentStatement = argsCompilations.reduce((f, item) => {
      return statement => f(item.augmentStatement(statement));
    }, functionCompilation.augmentStatement);

    if (resultingIdentifier) {
      return augmentStatement(procedureApplication);
    }

    return augmentStatement(
      localStatement(
        auxiliaryIdentifier,
        sequenceStatement(procedureApplication, statement),
      ),
    );
  };

  return {
    resultingExpression,
    augmentStatement,
  };
};
