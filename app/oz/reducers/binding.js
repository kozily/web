import Immutable from "immutable";
import {
  isEquivalenceClassBound,
  lookupVariableInStore,
  mergeEquivalenceClasses,
} from "../machine/store";

export default function(state, semanticStatement) {
  const store = state.get("store");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const operands = Immutable.List([statement.get("lhs"), statement.get("rhs")]);

  const equivalenceClasses = operands
    .map(x => x.get("identifier"))
    .map(identifier => environment.get(identifier))
    .map(x => lookupVariableInStore(store, x));

  const first = equivalenceClasses.get(0);
  const second = equivalenceClasses.get(1);

  if (isEquivalenceClassBound(first) && isEquivalenceClassBound(second)) {
    // TODO: Unify these two partial values
    return state;
  }

  const [target, source] = isEquivalenceClassBound(second)
    ? [second, first]
    : [first, second];

  return state.update("store", store =>
    mergeEquivalenceClasses(store, target, source),
  );
}
