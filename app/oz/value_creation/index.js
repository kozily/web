import { kernelLiteralTypes } from "../machine/literals";
import number from "./literals/number";
import record from "./literals/record";
import procedure from "./literals/procedure";

export const valueCreators = {
  [kernelLiteralTypes.number]: number,
  [kernelLiteralTypes.record]: record,
  [kernelLiteralTypes.procedure]: procedure,
};

export const createValue = (environment, literal) => {
  const creator = valueCreators[literal.get("type")];
  return creator(createValue, environment, literal);
};
