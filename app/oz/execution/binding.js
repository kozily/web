import { unify } from "../machine/sigma";
import { failureException, raiseSystemException } from "../machine/exceptions";

export default function(state, semanticStatement, activeThreadIndex) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const lhsIdentifier = statement.getIn(["lhs", "identifier"]);
  const lhsVariable = environment.get(lhsIdentifier);

  const rhsIdentifier = statement.getIn(["rhs", "identifier"]);
  const rhsVariable = environment.get(rhsIdentifier);

  try {
    const newSigma = unify(state.get("sigma"), lhsVariable, rhsVariable);
    return state.set("sigma", newSigma);
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, failureException());
  }
}
