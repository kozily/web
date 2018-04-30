import Immutable from "immutable";
import { valueTypes } from "../machine/values";
import { lookupVariableInSigma } from "../machine/sigma";
import { buildEnvironment } from "../machine/build";

const extractValueAndVariable = (thing, sigma) => {
  if (thing.get("node") === "value") {
    return Immutable.fromJS({ value: thing });
  }

  const value = lookupVariableInSigma(sigma, thing).get("value");
  return Immutable.fromJS({ value, variable: thing });
};

export default (recurse, evaluation, pattern, sigma) => {
  const value = evaluation.get("value");

  if (value.get("type") !== valueTypes.record) {
    return { match: false };
  }

  if (value.getIn(["value", "label"]) !== pattern.getIn(["value", "label"])) {
    return { match: false };
  }

  const evaluationFeatures = Immutable.Set(
    value.getIn(["value", "features"]).keySeq(),
  );
  const patternFeatures = Immutable.Set(
    pattern.getIn(["value", "features"]).keySeq(),
  );

  if (!Immutable.is(evaluationFeatures, patternFeatures)) {
    return { match: false };
  }

  const valuePairs = evaluationFeatures.map(x => [
    value.getIn(["value", "features", x]),
    pattern.getIn(["value", "features", x]),
  ]);

  const initialReduction = {
    match: true,
    additionalBindings: buildEnvironment(),
    sigma,
  };

  const result = valuePairs.reduce((result, [value, pattern]) => {
    if (!result.match) {
      return result;
    }

    const valueAndVariable = extractValueAndVariable(value, result.sigma);
    const recursiveMatch = recurse(valueAndVariable, pattern, result.sigma);

    if (!recursiveMatch.match) {
      return { match: false };
    }

    const accumulatedAdditionalBindings = result.additionalBindings.merge(
      recursiveMatch.additionalBindings,
    );

    const accumulatedSigma = result.sigma.union(recursiveMatch.sigma);

    return {
      match: true,
      additionalBindings: accumulatedAdditionalBindings,
      sigma: accumulatedSigma,
    };
  }, initialReduction);

  return result;
};
