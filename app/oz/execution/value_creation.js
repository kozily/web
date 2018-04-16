import { unifyVariableToValue, createValue } from "../machine/sigma";
import { failureException, raiseSystemException } from "../machine/exceptions";

export default function(state, semanticStatement, activeThreadIndex) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const identifier = statement.getIn(["lhs", "identifier"]);
  const variable = environment.get(identifier);

  const literal = statement.get("rhs");
  const value = createValue(environment, literal);

  try {
    return state.update("sigma", sigma =>
      unifyVariableToValue(sigma, variable, value),
    );
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, failureException());
  }
}
