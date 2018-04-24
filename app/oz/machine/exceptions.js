import { valueAtom } from "./values";
import { makeNewVariable } from "../machine/sigma";
import {
  buildEquivalenceClass,
  buildEnvironment,
  buildSemanticStatement,
} from "../machine/build";
import { exceptionRaiseStatement } from "../machine/statements";
import { makeAuxiliaryIdentifier } from "../machine/build";
import { identifierExpression } from "../machine/expressions";

export class UncaughtOzExceptionError extends Error {
  constructor(innerOzException) {
    super("Uncaught exception");
    this.name = this.constructor.name;
    this.innerOzException = innerOzException;
  }
}

export const failureException = () => {
  return valueAtom("failure");
};

export const errorException = () => {
  return valueAtom("error");
};

export const raiseSystemException = (state, activeThreadIndex, exception) => {
  const exceptionIdentifier = makeAuxiliaryIdentifier("SystemException");
  const exceptionIdentifierName = exceptionIdentifier.get("identifier");
  const exceptionVariable = makeNewVariable({
    in: state.get("sigma"),
    for: exceptionIdentifierName,
  });
  const newEquivalenceClass = buildEquivalenceClass(
    exception,
    exceptionVariable,
  );

  const newRaiseStatement = exceptionRaiseStatement(
    identifierExpression(exceptionIdentifier),
  );

  const newEnvironment = buildEnvironment({
    [exceptionIdentifierName]: exceptionVariable,
  });

  return state
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(buildSemanticStatement(newRaiseStatement, newEnvironment)),
    )
    .update("sigma", sigma => sigma.add(newEquivalenceClass));
};
