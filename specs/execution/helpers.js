import { exceptionRaiseStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  buildSemanticStatement,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
export const buildSystemExceptionState = (
  state,
  activeThreadIndex,
  exception,
) => {
  return state
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(
        buildSemanticStatement(
          exceptionRaiseStatement(lexicalIdentifier("__SYSTEM_EXCEPTION__")),
          buildEnvironment({
            __SYSTEM_EXCEPTION__: buildVariable("__SYSTEM_EXCEPTION__", 0),
          }),
        ),
      ),
    )
    .update("sigma", sigma =>
      sigma.add(
        buildEquivalenceClass(
          exception,
          buildVariable("__SYSTEM_EXCEPTION__", 0),
        ),
      ),
    );
};
