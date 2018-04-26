import Immutable from "immutable";
import { binaryOperator, typedOperator } from "./validations";
import { valueTypes } from "../machine/values";
import { lookupVariableInSigma } from "../machine/sigma";

const emptyFeatures = index => args => {
  return (
    args.some(x => x.get("value") === undefined) ||
    args.getIn([index, "value", "value", "features"]).isEmpty()
  );
};

const featureExists = args => {
  return (
    args.some(x => x.get("value") === undefined) ||
    !!args.getIn([
      0,
      "value",
      "value",
      "features",
      args.getIn([1, "value", "value", "label"]),
    ])
  );
};

export default {
  ".": {
    name: "rsel",
    validateArgs: args =>
      binaryOperator(args) &&
      typedOperator(valueTypes.record)(args) &&
      emptyFeatures(1)(args) &&
      featureExists(args),
    evaluate: (args, sigma) => {
      const missingArgument = args.find(x => !x.get("value"));
      if (missingArgument) {
        return Immutable.Map({
          waitCondition:
            missingArgument.get("waitCondition") ||
            missingArgument.get("variable"),
        });
      }
      const record = args.getIn([0, "value", "value"]);
      const feature = args.getIn([1, "value", "value", "label"]);
      const featureContents = record.getIn(["features", feature]);
      if (featureContents.get("node") === "value") {
        return Immutable.fromJS({ value: featureContents });
      }
      const value = lookupVariableInSigma(sigma, featureContents).get("value");
      return Immutable.fromJS({ value, variable: featureContents });
    },
  },
};
