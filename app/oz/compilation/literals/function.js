import { makeAuxiliaryIdentifier } from "../../machine/build";
import { bindingStatement, sequenceStatement } from "../../machine/statements";
import { identifierExpression } from "../../machine/expressions";
import { literalProcedure } from "../../machine/literals";

export default (recurse, literal) => {
  const value = literal.get("value");

  const functionArgs = value.get("args");
  const functionExpression = value.get("expression");
  const functionStatement = value.get("statement");

  const resultIdentifier = makeAuxiliaryIdentifier("res");
  const procedureArgs = functionArgs.push(resultIdentifier);

  const compiledExpression = recurse(
    functionExpression,
    identifierExpression(resultIdentifier),
  );

  const resultStatement = bindingStatement(
    identifierExpression(resultIdentifier),
    compiledExpression.resultingExpression,
  );

  const procedureStatement = functionStatement
    ? sequenceStatement(
        recurse(functionStatement),
        compiledExpression.augmentStatement(resultStatement),
      )
    : compiledExpression.augmentStatement(resultStatement);

  return literalProcedure(procedureArgs, procedureStatement);
};
