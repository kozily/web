import { valueTypes } from "../machine/values";
import number from "./number";
import record from "./record";
import procedure from "./procedure";

export const valueCreators = {
  [valueTypes.number]: number,
  [valueTypes.record]: record,
  [valueTypes.procedure]: procedure,
};

export const createValue = (environment, literal) => {
  const creator = valueCreators[literal.get("type")];
  return creator(environment, literal);
};
