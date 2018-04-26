import { buildSemanticStatement } from "../machine/build";
import { UncaughtOzExceptionError } from "../machine/exceptions";
import { evaluationToVariable } from "../machine/sigma";
import { blockCurrentThread } from "../machine/threads";
import { evaluate } from "../expression";
import { makeNewEnvironmentIndex } from "../machine/environment";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");
  const newIndex = makeNewEnvironmentIndex();

  const exceptionEvaluation = evaluate(
    statement.get("identifier"),
    environment,
    sigma,
  );

  if (exceptionEvaluation.get("waitCondition")) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      exceptionEvaluation.get("waitCondition"),
    );
  }

  const {
    sigma: augmentedSigma,
    variable: exceptionVariable,
  } = evaluationToVariable(exceptionEvaluation, sigma, "exception");

  if (exceptionEvaluation.get("waitCondition")) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      exceptionEvaluation.get("waitCondition"),
    );
  }

  const poppedState = state.updateIn(
    ["threads", activeThreadIndex, "stack"],
    stack =>
      stack.skipUntil(
        semanticStatement =>
          semanticStatement.getIn(["statement", "type"]) === "exceptionCatch",
      ),
  );

  if (poppedState.getIn(["threads", activeThreadIndex, "stack"]).isEmpty()) {
    const innerOzException = exceptionEvaluation.get("value");
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
    { environmentIndex: newIndex },
  );

  return poppedState
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.pop().push(handlingSemanticStatement),
    )
    .set("sigma", augmentedSigma);
}
