import { exceptionRaiseStatement } from "../../app/oz/machine/statements";
import { identifierExpression } from "../../app/oz/machine/expressions";
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
  const exceptionIdentifier = getLastAuxiliaryIdentifier("SystemException");
  const exceptionIdentifierName = exceptionIdentifier.get("identifier");
  return state
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(
        buildSemanticStatement(
          exceptionRaiseStatement(identifierExpression(exceptionIdentifier)),
          buildEnvironment({
            [exceptionIdentifierName]: buildVariable(
              exceptionIdentifierName,
              0,
            ),
          }),
        ),
      ),
    )
    .update("sigma", sigma =>
      sigma.add(
        buildEquivalenceClass(
          exception,
          buildVariable(exceptionIdentifierName, 0),
        ),
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
