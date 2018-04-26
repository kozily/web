import Immutable from "immutable";
import { unaryOperator, typedOperator } from "./validations";
import { valueTypes, valueAtom, valueList } from "../machine/values";

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

    const record = argument.getIn(["value", "value"]);
    const features = record
      .get("features")
      .keySeq()
      .sort()
      .map(f => valueAtom(f))
      .toArray();
    const value = valueList(features);
    return Immutable.Map({ value });
  },
};
