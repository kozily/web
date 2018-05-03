import Immutable from "immutable";
import { valueTypes } from "../machine/values";
import number from "./values/number";
import record from "./values/record";
import procedure from "./values/procedure";
import builtIn from "./values/built_in";
import mutable from "./values/mutable";
import name from "./values/name";

export const checkers = {
  [valueTypes.number]: number,
  [valueTypes.record]: record,
  [valueTypes.procedure]: procedure,
  [valueTypes.builtIn]: builtIn,
  [valueTypes.mutable]: mutable,
  [valueTypes.name]: name,
};

export const entail = (args, sigma) => {
  const missingArgument = args.find(x => !x.get("value"));
  if (missingArgument) {
    return Immutable.Map({
      waitCondition:
        missingArgument.get("waitCondition") || missingArgument.get("variable"),
    });
  }
  if (args.getIn([0, "value", "type"]) !== args.getIn([1, "value", "type"])) {
    return Immutable.Map({ value: false });
  }

  const checker = checkers[args.getIn([0, "value", "type"])];
  return checker(entail, args, sigma);
};
