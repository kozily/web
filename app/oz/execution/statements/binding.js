import Immutable from "immutable";
import { unify } from "../../machine/sigma";
import {
  errorException,
  failureException,
  raiseSystemException,
} from "../../machine/exceptions";
import { blockCurrentThread } from "../../machine/threads";
import { evaluate } from "../../evaluation";

export default function(state, semanticStatement, activeThreadIndex) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");
  const sigma = state.get("sigma");

  const argExpressions = Immutable.List.of(
    statement.get("lhs"),
    statement.get("rhs"),
  );

  try {
    const argEvaluations = argExpressions.map(expression =>
      evaluate(expression, environment, sigma),
    );

    const blockedEvaluation = argEvaluations.find(
      evaluation => !!evaluation.get("waitCondition"),
    );

    if (blockedEvaluation) {
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        blockedEvaluation.get("waitCondition"),
      );
    }

    try {
      return state.set(
        "sigma",
        unify(sigma, argEvaluations.first(), argEvaluations.last()),
      );
    } catch (error) {
      return raiseSystemException(state, activeThreadIndex, failureException());
    }
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, errorException());
  }
}
