import { valueTypes } from "../machine/values";
import number from "./values/number";
import record from "./values/record";
import procedure from "./values/procedure";
import builtIn from "./values/built_in";
import mutable from "./values/mutable";
import nameCreation from "./values/name_creation";

export const unificators = {
  [valueTypes.number]: number,
  [valueTypes.record]: record,
  [valueTypes.procedure]: procedure,
  [valueTypes.builtIn]: builtIn,
  [valueTypes.mutable]: mutable,
  [valueTypes.nameCreation]: nameCreation,
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
