import Immutable from "immutable";
import { unaryOperator, typedOperator } from "./validations";
import { valueTypes, valueAtom } from "../machine/values";

export default {
  validateArgs: args =>
    unaryOperator(args) && typedOperator(valueTypes.record)(args),
  evaluate: args => {
    const argument = args.get(0);
    if (!argument.get("value")) {
      return Immutable.Map({
        waitCondition:
          argument.get("waitCondition") || argument.get("variable"),
      });
    }

    const label = argument.getIn(["value", "value", "label"]);
    const value = valueAtom(label);
    return Immutable.Map({ value });
  },
};
