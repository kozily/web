import { lookupVariableInStore, makeNewVariable } from "../machine/store";
import {
  buildSemanticStatement,
  buildEquivalenceClass,
} from "../machine/build";

export default function(state, semanticStatement) {
  const store = state.get("store");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const identifier = statement.getIn(["variable", "identifier"]);
  const pattern = statement.getIn(["pattern"]);
  const trueStatement = statement.getIn(["true_statement"]);
  const falseStatement = statement.getIn(["false_statement"]);

  const variable = environment.get(identifier);
  const equivalentClass = lookupVariableInStore(store, variable);

  const value = equivalentClass.get("value");

  /* case value of pattern then true_statement else false_statement end */

  /* validations */
  /* check if value is bound */
  if (value === undefined) throw new Error("Unbound value in case statement");
  /* check if value is a record */
  if (value.get("type") !== "record")
    throw new Error(
      `Wrong type in case statement [type: ${value.get("type")}]`,
    );

  //TODO is this necessary?
  /* check if value has features */
  if (value.getIn(["value", "features"]).isEmpty())
    throw new Error("The case statement record must have features");

  const label = value.getIn(["value", "label"]);
  const patternLabel = pattern.getIn(["value", "label"]);

  /* checks if pattern matches */
  if (label === patternLabel) {
    const features = value.getIn(["value", "features"]);
    const patternFeatures = pattern.getIn(["value", "features"]);

    if (features.size === patternFeatures.size) {
      var featurekeysMatches = features.reduce(
        (accumulator, currentValue, currentIndex) => {
          return (
            accumulator &&
            patternFeatures.findKey((val, key) => {
              // comparing only keys of features
              return currentIndex === key;
            }) !== undefined
          );
        },
        true,
      );

      if (featurekeysMatches) {
        // declares the new variables specified in the pattern of the case
        const newState = patternFeatures
          .filter(x => x.get("node") === "variable")
          .reduce(
            (accumulator, currentValue) => {
              const featureIdentifier = currentValue.get("identifier");
              const newVariable = makeNewVariable({
                in: store,
                for: featureIdentifier,
              });

              const newEquivalenceClass = buildEquivalenceClass(
                undefined,
                newVariable,
              );

              return {
                state: accumulator.state.update("store", store =>
                  store.add(newEquivalenceClass),
                ),
                environment: accumulator.environment.set(
                  featureIdentifier,
                  newVariable,
                ),
              };
            },
            { state, environment: semanticStatement.get("environment") },
          );

        // unshift the true statement in the stack
        const newSemanticStatement = buildSemanticStatement(
          trueStatement,
          newState.environment,
        );

        return newState.state.update("stack", stack =>
          stack.push(newSemanticStatement),
        );
      }
    }
  }

  // Otherwise push (⟨s⟩2, E) on the stack.
  const newSemanticStatement = buildSemanticStatement(
    falseStatement,
    environment,
  );
  return state.update("stack", stack => stack.push(newSemanticStatement));
}
