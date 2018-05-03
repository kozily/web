import { kernelExpressionTypes } from "../machine/expressions";
import { kernelLiteralTypes } from "../machine/literals";
import literal from "./expressions/literal";
import identifier from "./expressions/identifier";
import operator from "./expressions/operator";
import number from "./literals/number";
import record from "./literals/record";
import procedure from "./literals/procedure";

export const evaluators = {
  expression: {
    [kernelExpressionTypes.literal]: literal,
    [kernelExpressionTypes.identifier]: identifier,
    [kernelExpressionTypes.operator]: operator,
  },
  literal: {
    [kernelLiteralTypes.number]: number,
    [kernelLiteralTypes.record]: record,
    [kernelLiteralTypes.procedure]: procedure,
  },
};

export const evaluate = (expression, environment, sigma) => {
  const evaluator = evaluators[expression.get("node")][expression.get("type")];
  return evaluator(evaluate, expression, environment, sigma);
};
