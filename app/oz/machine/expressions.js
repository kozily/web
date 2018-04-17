import Immutable from "immutable";

export const expressionTypes = {
  operator: "operator",
};

export const allExpressionTypes = Object.keys(expressionTypes);

export const operatorExpression = (operator, lhs, rhs) => {
  return Immutable.fromJS({
    node: "expression",
    type: "operator",
    operator,
    lhs,
    rhs,
  });
};
