import Immutable from "immutable";

export const kernelExpressionTypes = {
  operator: "operator",
  identifier: "identifier",
  literal: "literal",
};

export const compilableExpressionTypes = {
  function: "function",
  local: "local",
  conditional: "conditional",
  exceptionContext: "exceptionContext",
  patternMatching: "patternMatching",
  thread: "thread",
  nameCreation: "nameCreation",
  cellCreation: "cellCreation",
  portCreation: "portCreation",
  atCell: "atCell",
  colonEqualsCell: "colonEqualsCell",
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

export const conditionalExpression = (condition, trueClause, falseClause) => {
  return Immutable.fromJS({
    node: "expression",
    type: compilableExpressionTypes.conditional,
    condition,
    trueClause,
    falseClause,
  });
};

export const exceptionContextExpression = (
  tryClause,
  exceptionClause,
  exceptionIdentifier,
) => {
  return Immutable.fromJS({
    node: "expression",
    type: compilableExpressionTypes.exceptionContext,
    tryClause,
    exceptionClause,
    exceptionIdentifier,
  });
};

export const patternMatchingExpression = (identifier, clauses, falseClause) => {
  return Immutable.fromJS({
    node: "expression",
    type: compilableExpressionTypes.patternMatching,
    identifier,
    clauses,
    falseClause,
  });
};

export const threadExpression = (expression, statement) => {
  return Immutable.fromJS({
    node: "expression",
    type: compilableExpressionTypes.thread,
    expression,
    statement,
  });
};

export const nameCreationExpression = () => {
  return Immutable.fromJS({
    node: "expression",
    type: compilableExpressionTypes.nameCreation,
  });
};

export const cellCreationExpression = value => {
  return Immutable.fromJS({
    node: "expression",
    type: compilableExpressionTypes.cellCreation,
    value,
  });
};

export const portCreationExpression = value => {
  return Immutable.fromJS({
    node: "expression",
    type: compilableExpressionTypes.portCreation,
    value,
  });
};

export const atCellExpression = cell => {
  return Immutable.fromJS({
    node: "expression",
    type: compilableExpressionTypes.atCell,
    cell,
  });
};

export const colonEqualsCellExpression = (lhs, rhs) => {
  return Immutable.fromJS({
    node: "expression",
    type: compilableExpressionTypes.colonEqualsCell,
    operator: ":=",
    lhs,
    rhs,
  });
};

export const isBindable = expression =>
  expression.get("type") === kernelExpressionTypes.identifier ||
  (expression.get("type") === kernelExpressionTypes.operator &&
    expression.get("operator") === ".");
