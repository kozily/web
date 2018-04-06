import { valueAtom } from "./values";
import { makeNewVariable } from "../machine/sigma";
import {
  buildEquivalenceClass,
  buildEnvironment,
  buildSemanticStatement,
} from "../machine/build";
import { lexicalIdentifier } from "../machine/lexical";
import { exceptionRaiseStatement } from "../machine/statements";

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
  const exceptionVariable = makeNewVariable({
    in: state.get("sigma"),
    for: "__SYSTEM_EXCEPTION__",
  });
  const newEquivalenceClass = buildEquivalenceClass(
    exception,
    exceptionVariable,
  );

  const newRaiseStatement = exceptionRaiseStatement(
    lexicalIdentifier("__SYSTEM_EXCEPTION__"),
  );

  const newEnvironment = buildEnvironment({
    __SYSTEM_EXCEPTION__: exceptionVariable,
  });

  return state
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(buildSemanticStatement(newRaiseStatement, newEnvironment)),
    )
    .update("sigma", sigma => sigma.add(newEquivalenceClass));
};
