import { buildSemanticStatement } from "../machine/build";
import { UncaughtOzExceptionError } from "../machine/exceptions";
import { lookupVariableInSigma } from "../machine/sigma";

export default function(state, semanticStatement, activeThreadIndex) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const exceptionIdentifier = statement.getIn(["identifier", "identifier"]);
  const exceptionVariable = environment.get(exceptionIdentifier);

  const poppedState = state.updateIn(
    ["threads", activeThreadIndex, "stack"],
    stack =>
      stack.skipUntil(
        semanticStatement =>
          semanticStatement.getIn(["statement", "type"]) === "exceptionCatch",
      ),
  );

  if (poppedState.getIn(["threads", activeThreadIndex, "stack"]).isEmpty()) {
    const sigma = state.get("sigma");
    const exceptionEquivalenceClass = lookupVariableInSigma(
      sigma,
      exceptionVariable,
    );
    const innerOzException = exceptionEquivalenceClass.get("value");
    throw new UncaughtOzExceptionError(innerOzException);
  }

  const catchSemanticStatement = poppedState
    .getIn(["threads", activeThreadIndex, "stack"])
    .peek();

  const catchStatement = catchSemanticStatement.get("statement");
  const catchIdentifier = catchStatement.getIn([
    "exceptionIdentifier",
    "identifier",
  ]);
  const catchEnvironment = catchSemanticStatement.get("environment");

  const handlingStatement = catchStatement.get("exceptionStatement");
  const handlingEnvironment = catchEnvironment.set(
    catchIdentifier,
    exceptionVariable,
  );
  const handlingSemanticStatement = buildSemanticStatement(
    handlingStatement,
    handlingEnvironment,
  );

  return poppedState.updateIn(["threads", activeThreadIndex, "stack"], stack =>
    stack.pop().push(handlingSemanticStatement),
  );
}
