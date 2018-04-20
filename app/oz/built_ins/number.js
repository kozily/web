import Immutable from "immutable";
import { binaryOperator, typedOperator, dividendNotZero } from "./validations";
import { valueTypes, valueNumber } from "../machine/values";

export default {
  "+": {
    name: "nsum",
    validateArgs: args =>
      binaryOperator(args) && typedOperator(valueTypes.number)(args),
    evaluate: args => {
      const missingArgument = args.find(x => !x.get("value"));
      if (missingArgument) {
        return Immutable.Map({
          waitCondition: missingArgument.get("variable"),
        });
      }
      const lhs = args.getIn([0, "value", "value"]);
      const rhs = args.getIn([1, "value", "value"]);
      const value = valueNumber(lhs + rhs);
      return Immutable.Map({ value });
    },
  },
  "-": {
    name: "nsub",
    validateArgs: args =>
      binaryOperator(args) && typedOperator(valueTypes.number)(args),
    evaluate: args => {
      const missingArgument = args.find(x => !x.get("value"));
      if (missingArgument) {
        return Immutable.Map({
          waitCondition: missingArgument.get("variable"),
        });
      }
      const lhs = args.getIn([0, "value", "value"]);
      const rhs = args.getIn([1, "value", "value"]);
      const value = valueNumber(lhs - rhs);
      return Immutable.Map({ value });
    },
  },
  "*": {
    name: "nmul",
    validateArgs: args =>
      binaryOperator(args) && typedOperator(valueTypes.number)(args),
    evaluate: args => {
      const missingArgument = args.find(x => !x.get("value"));
      if (missingArgument) {
        return Immutable.Map({
          waitCondition: missingArgument.get("variable"),
        });
      }
      const lhs = args.getIn([0, "value", "value"]);
      const rhs = args.getIn([1, "value", "value"]);
      const value = valueNumber(lhs * rhs);
      return Immutable.Map({ value });
    },
  },
  div: {
    name: "ndiv",
    validateArgs: args =>
      binaryOperator(args) &&
      typedOperator(valueTypes.number)(args) &&
      dividendNotZero(args),
    evaluate: args => {
      const missingArgument = args.find(x => !x.get("value"));
      if (missingArgument) {
        return Immutable.Map({
          waitCondition: missingArgument.get("variable"),
        });
      }
      const lhs = args.getIn([0, "value", "value"]);
      const rhs = args.getIn([1, "value", "value"]);
      const value = valueNumber(Math.floor(lhs / rhs));
      return Immutable.Map({ value });
    },
  },
  mod: {
    name: "nmod",
    validateArgs: args =>
      binaryOperator(args) &&
      typedOperator(valueTypes.number)(args) &&
      dividendNotZero(args),
    evaluate: args => {
      const missingArgument = args.find(x => !x.get("value"));
      if (missingArgument) {
        return Immutable.Map({
          waitCondition: missingArgument.get("variable"),
        });
      }
      const lhs = args.getIn([0, "value", "value"]);
      const rhs = args.getIn([1, "value", "value"]);
      const value = valueNumber(lhs % rhs);
      return Immutable.Map({ value });
    },
  },
};
