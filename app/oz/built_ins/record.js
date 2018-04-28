import Immutable from "immutable";
import { binaryOperator, typedArgument } from "./validations";
import { valueTypes } from "../machine/values";
import { lookupVariableInSigma } from "../machine/sigma";

const emptyFeatures = index => args => {
  return (
    args.some(x => x.get("value") === undefined) ||
    args.getIn([index, "value", "value", "features"]).isEmpty()
  );
};

const atomFeatureExists = args => {
  return (
    args.some(x => x.get("value") === undefined) ||
    args.hasIn([
      0,
      "value",
      "value",
      "features",
      args.getIn([1, "value", "value", "label"]),
    ])
  );
};

const numberFeatureExists = args => {
  return (
    args.some(x => x.get("value") === undefined) ||
    args.hasIn([
      0,
      "value",
      "value",
      "features",
      args.getIn([1, "value", "value"]).toString(),
    ])
  );
};

export default {
  ".": {
    name: "rsel",
    returnResult: true,
    validateArgs: args =>
      binaryOperator(args) &&
      typedArgument(valueTypes.record, 0)(args) &&
      ((typedArgument(valueTypes.record, 1)(args) &&
        emptyFeatures(1)(args) &&
        atomFeatureExists(args)) ||
        (typedArgument(valueTypes.number, 1)(args) &&
          numberFeatureExists(args))),
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
      const feature =
        args.getIn([1, "value", "type"]) === "record"
          ? args.getIn([1, "value", "value", "label"])
          : args.getIn([1, "value", "value"]).toString();
      const featureContents = record.getIn(["features", feature]);
      if (featureContents.get("node") === "value") {
        return Immutable.fromJS({ value: featureContents });
      }
      const value = lookupVariableInSigma(sigma, featureContents).get("value");
      return Immutable.fromJS({ value, variable: featureContents });
    },
  },
};
