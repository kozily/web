import { makeNewVariable, unify, createValue } from "../machine/store";
import { buildEquivalenceClass } from "../machine/build";

export default function(state, semanticStatement) {
  const store = state.get("store");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const identifier = statement.getIn(["lhs", "identifier"]);
  const variable = environment.get(identifier);

  const literal = statement.get("rhs");
  const storeValue = createValue(environment, literal);

  const newVariable = makeNewVariable({
    in: state.get("store"),
    for: "__VALUE_CREATION__",
  });
  const newEquivalenceClass = buildEquivalenceClass(storeValue, newVariable);
  const newStore = store.add(newEquivalenceClass);
  const unifiedStore = unify(newStore, variable, newVariable);

  const resultingEquivalenceClass = unifiedStore.find(x =>
    x.get("variables").contains(newVariable),
  );

  const cleanUnifiedStore = unifiedStore
    .delete(resultingEquivalenceClass)
    .add(
      resultingEquivalenceClass.update("variables", variables =>
        variables.delete(newVariable),
      ),
    );

  return state.set("store", cleanUnifiedStore);
}
