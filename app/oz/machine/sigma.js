import Immutable from "immutable";
import { buildVariable } from "./build";
import { unifyValue } from "../unification";

export { createValue } from "../value_creation";

const identifier2variable = identifier => {
  return identifier.charAt(0).toLowerCase() + identifier.substring(1);
};

export const makeNewVariable = ({ in: sigma, for: identifier }) => {
  const variableName = identifier2variable(identifier);

  const currentMaximumVariable = sigma
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

export const lookupVariableInSigma = (sigma, variable) => {
  return sigma.find(ec =>
    ec.get("variables").some(x => Immutable.is(x, variable)),
  );
};

export const mergeEquivalenceClasses = (sigma, target, source) => {
  const sourceVariables = source.get("variables");

  const mergedEquivalenceClass = target.update("variables", variables =>
    variables.union(sourceVariables),
  );

  return sigma
    .delete(source)
    .delete(target)
    .add(mergedEquivalenceClass);
};

export const unify = (sigma, x, y) => {
  const equivalenceClassX = lookupVariableInSigma(sigma, x);
  const isXBound = isEquivalenceClassBound(equivalenceClassX);
  const equivalenceClassY = lookupVariableInSigma(sigma, y);
  const isYBound = isEquivalenceClassBound(equivalenceClassY);

  if (!isXBound && !isYBound) {
    return mergeEquivalenceClasses(sigma, equivalenceClassX, equivalenceClassY);
  } else if (!isXBound && isYBound) {
    return mergeEquivalenceClasses(sigma, equivalenceClassY, equivalenceClassX);
  } else if (isXBound && !isYBound) {
    return mergeEquivalenceClasses(sigma, equivalenceClassX, equivalenceClassY);
  } else {
    const xType = equivalenceClassX.getIn(["value", "type"]);
    const yType = equivalenceClassY.getIn(["value", "type"]);

    if (xType !== yType) {
      throw new Error(`Incompatible value types ${xType} and ${yType}`);
    }

    const unifiedSigma = unifyValue(
      unify,
      sigma,
      equivalenceClassX,
      equivalenceClassY,
    );
    return mergeEquivalenceClasses(
      unifiedSigma,
      equivalenceClassX,
      equivalenceClassY,
    );
  }
};