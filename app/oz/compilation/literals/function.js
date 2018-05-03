import { makeAuxiliaryIdentifier } from "../../machine/build";
import { identifierExpression } from "../../machine/expressions";
import { literalProcedure } from "../../machine/literals";
import { literalExpression } from "../../machine/expressions";
import {
  byNeedStatement,
  localStatement,
  sequenceStatement,
  bindingStatement,
} from "../../machine/statements";
import { compileStatementAndExpression } from "../expressions/helpers";

export default (recurse, literal) => {
  const value = literal.get("value");

  const functionArgs = value.get("args");

  const resultIdentifier = makeAuxiliaryIdentifier("res");
  const resultExpression = identifierExpression(resultIdentifier);

  const procedureArgs = functionArgs.push(resultIdentifier);

  const procedureBody = compileStatementAndExpression(
    recurse,
    value,
    resultExpression,
  );

  if (!value.get("lazy")) {
    const resultingExpression = literalProcedure(procedureArgs, procedureBody);

    const augmentStatement = statement => statement;

    return {
      resultingExpression,
      augmentStatement,
    };
  }

  const triggerIdentifier = makeAuxiliaryIdentifier("triggerProcedure");
  const triggerExpression = identifierExpression(triggerIdentifier);

  const lazyBody = localStatement(
    triggerIdentifier,
    sequenceStatement(
      bindingStatement(
        triggerExpression,
        literalExpression(literalProcedure([resultIdentifier], procedureBody)),
      ),
      byNeedStatement(triggerExpression, resultIdentifier),
    ),
  );

  const resultingExpression = literalProcedure(procedureArgs, lazyBody);

  const augmentStatement = statement => statement;

  return {
    resultingExpression,
    augmentStatement,
  };
};
