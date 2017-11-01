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

const unificators = {
  number: (store, equivalenceClassX, equivalenceClassY) => {
    const xValue = equivalenceClassX.getIn(["value", "value"]);
    const yValue = equivalenceClassY.getIn(["value", "value"]);

    if (xValue !== yValue) {
      throw new Error(`Incompatible values ${xValue} and ${yValue}`);
    }

    return store;
  },

  record: (store, equivalenceClassX, equivalenceClassY) => {
    const xValue = equivalenceClassX.getIn(["value", "value"]);
    const yValue = equivalenceClassY.getIn(["value", "value"]);

    const xLabel = xValue.get("label");
    const yLabel = yValue.get("label");
    if (xLabel !== yLabel) {
      throw new Error(`Incompatible labels ${xLabel} and ${yLabel}`);
    }

    const xFeatures = new Immutable.Set(xValue.get("features").keySeq());
    const yFeatures = new Immutable.Set(yValue.get("features").keySeq());

    if (!Immutable.is(xFeatures, yFeatures)) {
      throw new Error(
        `Incompatible features ${xFeatures.toJSON()} and ${yFeatures.toJSON()}`,
      );
    }

    return xFeatures.reduce((updatedStore, feature) => {
      const xVariable = xValue.getIn(["features", feature]);
      const yVariable = yValue.getIn(["features", feature]);

      return unify(updatedStore, xVariable, yVariable);
    }, store);
  },
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
    const xType = equivalenceClassX.getIn(["value", "type"]);
    const yType = equivalenceClassY.getIn(["value", "type"]);

    if (xType !== yType) {
      throw new Error(`Incompatible value types ${xType} and ${yType}`);
    }

    const unifyValue = unificators[xType];
    const unifiedStore = unifyValue(
      store,
      equivalenceClassX,
      equivalenceClassY,
    );
    return mergeEquivalenceClasses(
      unifiedStore,
      equivalenceClassX,
      equivalenceClassY,
    );
  }
};
