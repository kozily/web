import Immutable from "immutable";
import { buildVariable } from "./build";

const identifier2variable = identifier => {
  return identifier.charAt(0).toLowerCase() + identifier.substring(1);
};

export const makeNewVariable = ({ in: store, for: identifier }) => {
  const variableName = identifier2variable(identifier);

  const currentMaximumVariable = store
    .flatMap(equivalence => equivalence.get("variables"))
    .filter(variable => variable.get("name") === variableName)
    .maxBy(variable => variable.get("sequence"));

  if (currentMaximumVariable === undefined) {
    return buildVariable(variableName, 0);
  }

  return currentMaximumVariable.update("sequence", sequence => sequence + 1);
};

export const isEquivalenceClassBound = equivalenceClass => {
  return equivalenceClass.get("value") !== undefined;
};

export const lookupVariableInStore = (store, variable) => {
  return store.find(ec =>
    ec.get("variables").some(x => Immutable.is(x, variable)),
  );
};

export const mergeEquivalenceClasses = (store, target, source) => {
  const sourceVariables = source.get("variables");

  const mergedEquivalenceClass = target.update("variables", variables =>
    variables.union(sourceVariables),
  );

  return store
    .delete(source)
    .delete(target)
    .add(mergedEquivalenceClass);
};

export const unify = (store, x, y) => {
  const equivalenceClassX = lookupVariableInStore(store, x);
  const isXBound = isEquivalenceClassBound(equivalenceClassX);
  const equivalenceClassY = lookupVariableInStore(store, y);
  const isYBound = isEquivalenceClassBound(equivalenceClassY);

  if (!isXBound && !isYBound) {
    return mergeEquivalenceClasses(store, equivalenceClassX, equivalenceClassY);
  } else if (!isXBound && isYBound) {
    return mergeEquivalenceClasses(store, equivalenceClassY, equivalenceClassX);
  } else if (isXBound && !isYBound) {
    return mergeEquivalenceClasses(store, equivalenceClassX, equivalenceClassY);
  } else {
    return store;
    // TODO: Handle value unification
  }
};
