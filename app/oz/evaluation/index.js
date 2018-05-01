import { kernelExpressionTypes } from "../machine/expressions";
import literal from "./expressions/literal";
import identifier from "./expressions/identifier";
import operator from "./expressions/operator";

export const evaluators = {
  [kernelExpressionTypes.literal]: literal,
  [kernelExpressionTypes.identifier]: identifier,
  [kernelExpressionTypes.operator]: operator,
};

export const evaluate = (expression, environment, sigma) => {
  const evaluator = evaluators[expression.get("type")];
  return evaluator(evaluate, expression, environment, sigma);
};
