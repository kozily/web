import { valueTypes } from "../machine/values";
import number from "./number";
import record from "./record";
import procedure from "./procedure";
import builtIn from "./built_in";

export const unificators = {
  [valueTypes.number]: number,
  [valueTypes.record]: record,
  [valueTypes.procedure]: procedure,
  [valueTypes.builtIn]: builtIn,
};

export const unifyValue = (
  recurse,
  sigma,
  equivalenceClassX,
  equivalenceClassY,
) => {
  const unificator = unificators[equivalenceClassX.getIn(["value", "type"])];
  return unificator(recurse, sigma, equivalenceClassX, equivalenceClassY);
};
