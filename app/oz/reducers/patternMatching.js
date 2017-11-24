import { lookupVariableInStore } from "../machine/store";
import { buildSemanticStatement } from "../machine/build";

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
  if (label === patternLabel) {
    const features = value.getIn(["value", "features"]);
    const patternFeatures = pattern.getIn(["value", "features"]);
    if (features.size === patternFeatures.size) {
      var keyMatches = features.reduce((r, v, k, i) => {
        return (
          r &&
          patternFeatures.findKey((val, key, it) => {
            return k === key;
          }) !== undefined
        );
      }, true);

      if (keyMatches) {
        /* TODO create variable values for values of features and assign the same value of the variable then push to the state */
        
      } else {
        throw new Error(
          `Unexpected record features in case statement, keys do not match [variable keys: ${features.toJSON()}, pattern keys: ${patternFeatures.toJSON()}]`,
        );
      }
    } else {
      throw new Error(
        `Unexpected record features in case statement, size does not match [size: ${features.size}]`,
      );
    }
  } else {
    throw new Error(
      `Unexpected record label in case statement [label: ${label}]`,
    );
  }
}
