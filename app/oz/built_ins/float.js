import { binaryOperator, typedOperator, dividendNotZero } from "./validations";
import { valueTypes, valueNumber } from "../machine/values";

export default {
  "/": {
    name: "fdiv",
    validateArgs: args =>
      binaryOperator(args) &&
      typedOperator(valueTypes.number)(args) &&
      dividendNotZero(args),
    evaluate: args => {
      const lhs = args.getIn([0, "value"]);
      const rhs = args.getIn([1, "value"]);
      if (!lhs) {
        return { missingArg: 0 };
      }
      if (!rhs) {
        return { missingArg: 1 };
      }
      const value = valueNumber(lhs / rhs);
      return { value };
    },
  },
};
