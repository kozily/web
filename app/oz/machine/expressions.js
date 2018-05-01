import Immutable from "immutable";

export const kernelExpressionTypes = {
  operator: "operator",
  identifier: "identifier",
  literal: "literal",
};

export const compilableExpressionTypes = {
  function: "function",
  local: "local",
};

export const literalExpression = literal => {
  return Immutable.fromJS({
    node: "expression",
    type: kernelExpressionTypes.literal,
    literal: literal,
  });
};

export const identifierExpression = identifier => {
  return Immutable.fromJS({
    node: "expression",
    type: kernelExpressionTypes.identifier,
    identifier,
  });
};

export const operatorExpression = (operator, lhs, rhs) => {
  return Immutable.fromJS({
    node: "expression",
    type: kernelExpressionTypes.operator,
    operator,
    lhs,
    rhs,
  });
};

export const functionExpression = (fun, args = []) => {
  return Immutable.fromJS({
    node: "expression",
    type: compilableExpressionTypes.function,
    fun,
    args,
  });
};

export const localExpression = (identifiers, expression, statement) => {
  return Immutable.fromJS({
    node: "expression",
    type: compilableExpressionTypes.local,
    identifiers,
    expression,
    statement,
  });
};

export const isBindable = expression =>
  expression.get("type") === kernelExpressionTypes.identifier ||
  (expression.get("type") === kernelExpressionTypes.operator &&
    expression.get("operator") === ".");
