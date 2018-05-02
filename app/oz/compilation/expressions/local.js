import { identifierExpression } from "../../machine/expressions";
import { makeAuxiliaryIdentifier } from "../../machine/build";
import { localStatement } from "../../machine/statements";
import {
  compileStatementAndExpression,
  makeStatementAugmentation,
} from "./helpers";

export default (recurse, node, resultingIdentifier) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier("exp");

  const resultingExpression = resultingIdentifier
    ? resultingIdentifier
    : identifierExpression(auxiliaryIdentifier);

  const compiledBody = compileStatementAndExpression(
    recurse,
    node,
    resultingExpression,
  );

  const resultingStatement = node
    .get("identifiers")
    .reduceRight(
      (child, identifier) => localStatement(identifier, child),
      compiledBody,
    );

  const augmentStatement = makeStatementAugmentation(
    resultingIdentifier,
    auxiliaryIdentifier,
    resultingStatement,
  );

  return {
    resultingExpression,
    augmentStatement,
  };
};
