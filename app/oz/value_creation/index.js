import { literalTypes } from "../machine/literals";
import number from "./number";
import record from "./record";
import procedure from "./procedure";

export const valueCreators = {
  [literalTypes.number]: number,
  [literalTypes.record]: record,
  [literalTypes.procedure]: procedure,
};

export const createValue = (environment, literal) => {
  const creator = valueCreators[literal.get("type")];
  return creator(createValue, environment, literal);
};
