import { makeNewVariable, unify } from "../machine/store";
import { buildEquivalenceClass } from "../machine/build";

const valueCreators = {
  number: (environment, value) => {
    return value;
  },

  record: (environment, value) => {
    return value.updateIn(["value", "features"], features => {
      return features.map(feature => {
        const identifier = feature.get("identifier");
        return environment.get(identifier);
      });
    });
  },
};

const createStoreValue = (environment, lexicalValue) => {
  const creator = valueCreators[lexicalValue.get("type")];
  return creator(environment, lexicalValue);
};

export default function(state, semanticStatement) {
  const store = state.get("store");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const identifier = statement.getIn(["lhs", "identifier"]);
  const variable = environment.get(identifier);

  const lexicalValue = statement.get("rhs");
  const storeValue = createStoreValue(environment, lexicalValue);

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
