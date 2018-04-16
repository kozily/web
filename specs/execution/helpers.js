import { exceptionRaiseStatement } from "../../app/oz/machine/statements";
import {
  buildSemanticStatement,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
  getLastAuxiliaryIdentifier,
} from "../../app/oz/machine/build";

export const buildSystemExceptionState = (
  state,
  activeThreadIndex,
  exception,
) => {
  const aux = getLastAuxiliaryIdentifier("system_exception");
  const auxIdentifier = aux.get("identifier");
  return state
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(
        buildSemanticStatement(
          exceptionRaiseStatement(aux),
          buildEnvironment({
            [auxIdentifier]: buildVariable(auxIdentifier, 0),
          }),
        ),
      ),
    )
    .update("sigma", sigma =>
      sigma.add(
        buildEquivalenceClass(exception, buildVariable(auxIdentifier, 0)),
      ),
    );
};
