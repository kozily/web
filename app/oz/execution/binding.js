import { unify } from "../machine/sigma";

export default function(state, semanticStatement) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const lhsIdentifier = statement.getIn(["lhs", "identifier"]);
  const lhsVariable = environment.get(lhsIdentifier);

  const rhsIdentifier = statement.getIn(["rhs", "identifier"]);
  const rhsVariable = environment.get(rhsIdentifier);

  return state.update("sigma", sigma => unify(sigma, lhsVariable, rhsVariable));
}
