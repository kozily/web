import { expressionTypes } from "../machine/expressions";
import literal from "./literal";
import identifier from "./identifier";
import operator from "./operator";

export const evaluators = {
  [expressionTypes.literal]: literal,
  [expressionTypes.identifier]: identifier,
  [expressionTypes.operator]: operator,
};

export const evaluate = (expression, environment, sigma) => {
  const evaluator = evaluators[expression.get("type")];
  return evaluator(evaluate, expression, environment, sigma);
};
