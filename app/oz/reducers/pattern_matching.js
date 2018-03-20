import Immutable from "immutable";
import { lookupVariableInStore } from "../machine/store";
import { buildSemanticStatement } from "../machine/build";

export default function(state, semanticStatement) {
  const store = state.get("store");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const identifier = statement.getIn(["identifier", "identifier"]);
  const pattern = statement.getIn(["pattern"]);
  const trueStatement = statement.getIn(["true_statement"]);
  const falseStatement = statement.getIn(["false_statement"]);

  const variable = environment.get(identifier);
  const equivalentClass = lookupVariableInStore(store, variable);

  const value = equivalentClass.get("value");

  if (value === undefined) throw new Error("Unbound value in case statement");

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

      return state.update("stack", stack =>
        stack.push(buildSemanticStatement(trueStatement, newEnvironment)),
      );
    }
  }

  return state.update("stack", stack =>
    stack.push(buildSemanticStatement(falseStatement, environment)),
  );
}
