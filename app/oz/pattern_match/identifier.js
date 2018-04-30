import { buildEnvironment } from "../machine/build";
import { convertToVariable } from "../machine/sigma";

export default (recurse, evaluation, pattern, sigma) => {
  const { sigma: augmentedSigma, variable } = convertToVariable(
    evaluation,
    sigma,
    "patternMatch",
  );

  return {
    match: true,
    additionalBindings: buildEnvironment({
      [pattern.get("identifier")]: variable,
    }),
    sigma: augmentedSigma,
  };
};
