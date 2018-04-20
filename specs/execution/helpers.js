import { exceptionRaiseStatement } from "../../app/oz/machine/statements";
import {
  threadStatus,
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

export const buildBlockedState = (
  state,
  statement,
  activeThreadIndex,
  waitCondition,
) => {
  return state
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(statement),
    )
    .updateIn(["threads", activeThreadIndex, "metadata"], metadata =>
      metadata
        .set("status", threadStatus.blocked)
        .set("waitCondition", waitCondition),
    );
};
