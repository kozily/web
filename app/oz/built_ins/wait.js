import Immutable from "immutable";
import { unaryOperator } from "./validations";

export default {
  returnResult: false,
  validateArgs: args => unaryOperator(args),
  evaluate: args => {
    const argument = args.get(0);
    const value = argument.get("value");
    const variable = argument.get("variable");
    const waitCondition = argument.get("waitCondition");
    if (waitCondition) {
      return Immutable.Map({ waitCondition });
    }
    if (!value && variable) {
      return Immutable.Map({ waitCondition: variable });
    }
    if (value && !variable) {
      return Immutable.Map({ value });
    }
    return Immutable.Map({ variable });
  },
};
