import Immutable from "immutable";

export const expressionTypes = {
  operator: "operator",
  identifier: "identifier",
  literal: "literal",
};

export const allExpressionTypes = Object.keys(expressionTypes);

export const literalExpression = literal => {
  return Immutable.fromJS({
    node: "expression",
    type: "literal",
    literal: literal,
  });
};

export const identifierExpression = identifier => {
  return Immutable.fromJS({
    node: "expression",
    type: "identifier",
    identifier,
  });
};

export const operatorExpression = (operator, lhs, rhs) => {
  return Immutable.fromJS({
    node: "expression",
    type: "operator",
    operator,
    lhs,
    rhs,
  });
};
