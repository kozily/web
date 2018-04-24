import Immutable from "immutable";
import { valueTypes } from "../machine/values";
import number from "./number";
import record from "./record";
import procedure from "./procedure";
import builtIn from "./built_in";

export const checkers = {
  [valueTypes.number]: number,
  [valueTypes.record]: record,
  [valueTypes.procedure]: procedure,
  [valueTypes.builtIn]: builtIn,
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
