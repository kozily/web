import Immutable from "immutable";
import { unaryOperator } from "./validations";
import { valueBoolean } from "../machine/values";

export default {
  returnResult: true,
  validateArgs: args => unaryOperator(args),
  evaluate: args => {
    const argument = args.get(0);
    const value = argument.get("value");
    if (!value) {
      return Immutable.Map({ value: valueBoolean(false) });
    }
    return Immutable.Map({ value: valueBoolean(true) });
  },
};
