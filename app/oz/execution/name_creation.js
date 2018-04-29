import { unify } from "../machine/sigma";
import { failureException, raiseSystemException } from "../machine/exceptions";
import { valueNameCreation } from "../machine/values";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const nameIdentifier = statement.getIn(["name", "identifier"]);
  const nameVariable = environment.get(nameIdentifier);

  try {
    const unifiedSigma = unify(sigma, nameVariable, valueNameCreation());

    return state.set("sigma", unifiedSigma);
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, failureException());
  }
}
