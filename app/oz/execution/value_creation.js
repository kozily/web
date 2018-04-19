import { unifyVariableToEvaluation } from "../machine/sigma";
import { failureException, raiseSystemException } from "../machine/exceptions";
import { evaluate } from "../expression";

export default function(state, semanticStatement, activeThreadIndex) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");
  const sigma = state.get("sigma");

  const identifier = statement.getIn(["lhs", "identifier"]);
  const variable = environment.get(identifier);

  const expression = statement.get("rhs");
  const expressionEvaluation = evaluate(expression, environment, sigma);

  try {
    return state.update("sigma", sigma =>
      unifyVariableToEvaluation(sigma, variable, expressionEvaluation),
    );
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, failureException());
  }
}
