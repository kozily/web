import Immutable from "immutable";
import { valueTypes } from "../../machine/values";
import { buildEnvironment } from "../../machine/build";

export default (recurse, evaluation, pattern, sigma) => {
  const value = evaluation.get("value");

  if (value.get("type") !== valueTypes.number) {
    return { match: false };
  }

  if (!Immutable.is(value.get("value"), pattern.get("value"))) {
    return { match: false };
  }

  return {
    match: true,
    additionalBindings: buildEnvironment(),
    sigma,
  };
};
