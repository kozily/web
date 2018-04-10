import Immutable from "immutable";
import { lookupVariableInSigma } from "../machine/sigma";
import { buildSemanticStatement } from "../machine/build";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const identifier = statement.getIn(["identifier", "identifier"]);
  const pattern = statement.getIn(["pattern"]);
  const trueStatement = statement.getIn(["trueStatement"]);
  const falseStatement = statement.getIn(["falseStatement"]);

  const variable = environment.get(identifier);
  const equivalentClass = lookupVariableInSigma(sigma, variable);

  const value = equivalentClass.get("value");

  if (value === undefined) {
    return state
      .setIn(["threads", activeThreadIndex, "metadata", "status"], "blocked")
      .updateIn(["threads", activeThreadIndex, "stack"], stack =>
        stack.push(semanticStatement),
      );
  }

  if (
    value.get("type") === "record" &&
    value.getIn(["value", "label"]) === pattern.getIn(["value", "label"])
  ) {
    const valueFeatures = value.getIn(["value", "features"]);
    const patternFeatures = pattern.getIn(["value", "features"]);

    if (
      Immutable.is(
        valueFeatures.keySeq().toSet(),
        patternFeatures.keySeq().toSet(),
      )
    ) {
      const newEnvironment = patternFeatures.reduce(
        (result, identifier, feature) => {
          return result.set(
            identifier.get("identifier"),
            valueFeatures.get(feature),
          );
        },
        environment,
      );

      return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
        stack.push(buildSemanticStatement(trueStatement, newEnvironment)),
      );
    }
  }

  return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
    stack.push(buildSemanticStatement(falseStatement, environment)),
  );
}
