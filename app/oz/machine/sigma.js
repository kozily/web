import Immutable from "immutable";
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

export const makeNewVariable = ({
  in: sigma,
  for: identifier,
  options = {},
}) => {
  const variableName = identifier2variable(identifier);

  const currentMaximumVariable = sigma
    .flatMap(equivalence => equivalence.get("variables"))
    .filter(variable => variable.get("name") === variableName)
    .maxBy(variable => variable.get("sequence"));

  if (currentMaximumVariable === undefined) {
    return buildVariable(variableName, 0, options);
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

const valueToVariable = (value, sigma, namespace = "system") => {
  const auxIdentifier = makeAuxiliaryIdentifier(namespace);
  const auxVariable = makeNewVariable({
    in: sigma,
    for: auxIdentifier.get("identifier"),
  });
  const auxEquivalenceClass = buildEquivalenceClass(value, auxVariable);

  return { sigma: sigma.add(auxEquivalenceClass), variable: auxVariable };
};

const evaluationToVariable = (evaluation, sigma, namespace = "system") => {
  if (evaluation.has("variable")) {
    return { sigma, variable: evaluation.get("variable") };
  }

  return valueToVariable(evaluation.get("value"), sigma, namespace);
};

export const convertToVariable = (thing, sigma, namespace = "system") => {
  if (thing.get("node") === "value") {
    return valueToVariable(thing, sigma, namespace);
  }

  if (thing.has("name") && thing.has("sequence")) {
    return { sigma, variable: thing };
  }

  return evaluationToVariable(thing, sigma, namespace);
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

const hasVariable = thing => {
  return (thing.has("name") && thing.has("sequence")) || thing.has("variable");
};

const accumulateVariables = (sigma, ...args) => {
  return Immutable.List(args).reduce(
    (accumulator, argument) => {
      const conversion = convertToVariable(argument, accumulator.sigma);

      return {
        sigma: conversion.sigma,
        variables: accumulator.variables.push(conversion.variable),
      };
    },
    { sigma, variables: Immutable.List() },
  );
};

const clearTempVariable = (sigma, thing, variable) => {
  if (hasVariable(thing)) {
    return sigma;
  }

  const equivalenceClass = lookupVariableInSigma(sigma, variable);
  const cleanSigma = sigma.delete(equivalenceClass);

  const updatedEquivalenceClass = equivalenceClass.update(
    "variables",
    variables => variables.delete(variable),
  );
  if (updatedEquivalenceClass.get("variables").isEmpty()) {
    return cleanSigma;
  }

  return cleanSigma.add(updatedEquivalenceClass);
};

export const unify = (sigma, x, y) => {
  const { sigma: augmentedSigma, variables } = accumulateVariables(sigma, x, y);

  const xVariable = variables.first();
  const yVariable = variables.last();

  const equivalenceClassX = lookupVariableInSigma(augmentedSigma, xVariable);
  const isXBound = isEquivalenceClassBound(equivalenceClassX);
  const equivalenceClassY = lookupVariableInSigma(augmentedSigma, yVariable);
  const isYBound = isEquivalenceClassBound(equivalenceClassY);

  const clearTempVariables = sigma => {
    return clearTempVariable(
      clearTempVariable(sigma, y, yVariable),
      x,
      xVariable,
    );
  };

  if (!isXBound && !isYBound) {
    return clearTempVariables(
      mergeEquivalenceClasses(
        augmentedSigma,
        equivalenceClassX,
        equivalenceClassY,
      ),
    );
  } else if (!isXBound && isYBound) {
    return clearTempVariables(
      mergeEquivalenceClasses(
        augmentedSigma,
        equivalenceClassY,
        equivalenceClassX,
      ),
    );
  } else if (isXBound && !isYBound) {
    return clearTempVariables(
      mergeEquivalenceClasses(
        augmentedSigma,
        equivalenceClassX,
        equivalenceClassY,
      ),
    );
  } else {
    const xType = equivalenceClassX.getIn(["value", "type"]);
    const yType = equivalenceClassY.getIn(["value", "type"]);

    if (xType !== yType) {
      throw new Error(`Incompatible value types ${xType} and ${yType}`);
    }

    const unifiedSigma = unifyValue(
      unify,
      augmentedSigma,
      equivalenceClassX,
      equivalenceClassY,
    );

    return clearTempVariables(
      mergeEquivalenceClasses(
        unifiedSigma,
        equivalenceClassX,
        equivalenceClassY,
      ),
    );
  }
};
