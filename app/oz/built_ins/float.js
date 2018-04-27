import Immutable from "immutable";
import { binaryOperator, typedOperator, dividendNotZero } from "./validations";
import { valueTypes, valueNumber } from "../machine/values";

export default {
  "/": {
    name: "fdiv",
    returnResult: true,
    validateArgs: args =>
      binaryOperator(args) &&
      typedOperator(valueTypes.number)(args) &&
      dividendNotZero(args),
    evaluate: args => {
      const missingArgument = args.find(x => !x.get("value"));
      if (missingArgument) {
        return Immutable.Map({
          waitCondition:
            missingArgument.get("waitCondition") ||
            missingArgument.get("variable"),
        });
      }
      const lhs = args.getIn([0, "value", "value"]);
      const rhs = args.getIn([1, "value", "value"]);
      const value = valueNumber(lhs / rhs);
      return Immutable.Map({ value });
    },
  },
};
