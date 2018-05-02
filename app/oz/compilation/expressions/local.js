import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import {
  localStatement,
  bindingStatement,
  sequenceStatement,
} from "../../machine/statements";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const compiledExpression = recurse(
    node.get("expression"),
    resultingIdentifier,
  );

  const finalBinding = compiledExpression.augmentStatement(
    bindingStatement(
      resultingExpression,
      compiledExpression.resultingExpression,
    ),
  );

  const childStatement = node.get("statement")
    ? sequenceStatement(recurse(node.get("statement")), finalBinding)
    : finalBinding;

  const resultingStatement = node
    .get("identifiers")
    .reduceRight(
      (child, identifier) => localStatement(identifier, child),
      childStatement,
    );

  const augmentStatement = statement => {
    if (resultingIdentifier) {
      return resultingStatement;
    }

    return localStatement(
      auxiliaryIdentifier,
      sequenceStatement(resultingStatement, statement),
    );
  };

  return {
    resultingExpression,
    augmentStatement,
  };
};
