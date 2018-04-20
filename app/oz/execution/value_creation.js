import { unifyVariableToEvaluation } from "../machine/sigma";
import {
  errorException,
  failureException,
  raiseSystemException,
} from "../machine/exceptions";
import { blockCurrentThread } from "../machine/threads";
import { evaluate } from "../expression";

export default function(state, semanticStatement, activeThreadIndex) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");
  const sigma = state.get("sigma");

  const identifier = statement.getIn(["lhs", "identifier"]);
  const variable = environment.get(identifier);

  const expression = statement.get("rhs");

  try {
    const evaluation = evaluate(expression, environment, sigma);
    if (evaluation.get("waitCondition")) {
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        evaluation.get("waitCondition"),
      );
    }

    try {
      return state.update("sigma", sigma =>
        unifyVariableToEvaluation(sigma, variable, evaluation),
      );
    } catch (error) {
      return raiseSystemException(state, activeThreadIndex, failureException());
    }
  } catch (e) {
    return raiseSystemException(state, activeThreadIndex, errorException());
  }
}
