import {
  buildVariable,
  makeAuxiliaryIdentifier,
  buildEquivalenceClass,
} from "./build";
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
    ec
      .get("variables")
      .some(
        x =>
          x.get("name") === variable.get("name") &&
          x.get("sequence") === variable.get("sequence"),
      ),
  );
};

export const mergeEquivalenceClasses = (sigma, target, source) => {
  const sourceVariables = source.get("variables");

  const mergedEquivalenceClass = target.update("variables", variables =>
    variables.concat(sourceVariables),
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

export const unifyVariableToValue = (sigma, variable, value) => {
  const auxiliaryIdentifier = makeAuxiliaryIdentifier();
  const auxiliaryVariable = makeNewVariable({
    in: sigma,
    for: auxiliaryIdentifier.get("identifier"),
  });

  const auxiliaryEquivalenceClass = buildEquivalenceClass(
    value,
    auxiliaryVariable,
  );
  const intermediateSigma = sigma.add(auxiliaryEquivalenceClass);

  const unifiedSigma = unify(intermediateSigma, variable, auxiliaryVariable);
  const resultingEquivalenceClass = lookupVariableInSigma(
    unifiedSigma,
    auxiliaryVariable,
  );

  return unifiedSigma
    .delete(resultingEquivalenceClass)
    .add(
      resultingEquivalenceClass.update("variables", variables =>
        variables.delete(auxiliaryVariable),
      ),
    );
};

export const unifyVariableToEvaluation = (sigma, variable, evaluation) => {
  if (evaluation.get("variable")) {
    return unify(sigma, variable, evaluation.get("variable"));
  }

  return unifyVariableToValue(sigma, variable, evaluation.get("value"));
};
