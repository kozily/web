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

  const resultStatement = bindingStatement(
    identifierExpression(resultIdentifier),
    recurse(functionExpression),
  );

  const procedureStatement = functionStatement
    ? sequenceStatement(recurse(functionStatement), resultStatement)
    : resultStatement;

  return literalProcedure(procedureArgs, procedureStatement);
};
