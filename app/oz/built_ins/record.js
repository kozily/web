import { binaryOperator } from "./validations";
import { valueTypes } from "../machine/values";
import { lookupVariableInSigma } from "../machine/sigma";

export default {
  ".": {
    name: "rsel",
    validateArgs: args =>
      binaryOperator(args) &&
      args.getIn([0, "type"]) === valueTypes.record &&
      args.getIn([1, "type"]) === valueTypes.record &&
      args.getIn([1, "value", "features"]).isEmpty() &&
      !!args.getIn([0, "value", "features", args.getIn([1, "value", "label"])]),
    evaluate: (args, sigma) => {
      const record = args.getIn([0, "value"]);
      const feature = args.getIn([1, "value", "label"]);
      if (!record) {
        return { missingArg: 0 };
      }
      if (!feature) {
        return { missingArg: 1 };
      }
      const variable = record.getIn(["features", feature]);
      const value = lookupVariableInSigma(sigma, variable).get("value");
      return { value, variable };
    },
  },
};
