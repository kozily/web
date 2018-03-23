import { valueTypes } from "../machine/values";
import number from "./number";
import record from "./record";
import procedure from "./procedure";

export const unificators = {
  [valueTypes.number]: number,
  [valueTypes.record]: record,
  [valueTypes.procedure]: procedure,
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