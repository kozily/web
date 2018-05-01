import { buildEnvironment } from "../../machine/build";
import { convertToVariable } from "../../machine/sigma";

export default (recurse, evaluation, pattern, sigma) => {
  const { sigma: augmentedSigma, variable } = convertToVariable(
    evaluation,
    sigma,
    "patternMatch",
  );
  const identifier = pattern.get("identifier");

  return {
    match: true,
    additionalBindings:
      identifier === "_"
        ? buildEnvironment()
        : buildEnvironment({
            [identifier]: variable,
          }),
    sigma: identifier === "_" ? sigma : augmentedSigma,
  };
};
