import Immutable from "immutable";

export const statementTypes = {
  skip: "skip",
  sequence: "sequence",
  local: "local",
  binding: "binding",
  valueCreation: "valueCreation",
  conditional: "conditional",
  patternMatching: "patternMatching",
  procedureApplication: "procedureApplication",
  exceptionContext: "exceptionContext",
  exceptionRaise: "exceptionRaise",
  exceptionCatch: "exceptionCatch",
  thread: "thread",
  byNeed: "byNeed",
  cellCreation: "cellCreation",
  portCreation: "portCreation",
  portSend: "portSend",
};

export const allStatementTypes = Object.keys(statementTypes);

export const sequenceStatement = (head, tail) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementTypes.sequence,
    head,
    tail,
  });
};

export const skipStatement = () => {
  return Immutable.fromJS({
    node: "statement",
    type: statementTypes.skip,
  });
};

export const localStatement = (identifier, statement) => {
  return Immutable.Map({
    node: "statement",
    type: statementTypes.local,
    identifier,
    statement,
  });
};

export const bindingStatement = (lhs, rhs) => {
  return Immutable.Map({
    node: "statement",
    type: statementTypes.binding,
    lhs,
    rhs,
  });
};

export const valueCreationStatement = (lhs, rhs) => {
  return Immutable.Map({
    node: "statement",
    type: statementTypes.valueCreation,
    lhs,
    rhs,
  });
};

export const conditionalStatement = (
  condition,
  trueStatement,
  falseStatement = undefined,
) => {
  return Immutable.Map({
    node: "statement",
    type: statementTypes.conditional,
    condition,
    trueStatement,
    falseStatement,
  });
};

export const patternMatchingStatement = (
  identifier,
  pattern,
  trueStatement,
  falseStatement = undefined,
) => {
  return Immutable.Map({
    node: "statement",
    type: statementTypes.patternMatching,
    identifier,
    pattern,
    trueStatement,
    falseStatement,
  });
};

export const procedureApplicationStatement = (procedure, args = []) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementTypes.procedureApplication,
    procedure,
    args,
  });
};

export const exceptionContextStatement = (
  triedStatement,
  exceptionIdentifier,
  exceptionStatement,
) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementTypes.exceptionContext,
    triedStatement,
    exceptionIdentifier,
    exceptionStatement,
  });
};

export const exceptionRaiseStatement = identifier => {
  return Immutable.fromJS({
    node: "statement",
    type: statementTypes.exceptionRaise,
    identifier,
  });
};

export const exceptionCatchStatement = (
  exceptionIdentifier,
  exceptionStatement,
) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementTypes.exceptionCatch,
    exceptionIdentifier,
    exceptionStatement,
  });
};

export const threadStatement = body => {
  return Immutable.fromJS({
    node: "statement",
    type: statementTypes.thread,
    body,
  });
};

export const byNeedStatement = (procedure, neededIdentifier) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementTypes.byNeed,
    procedure,
    neededIdentifier,
  });
};

export const cellCreationStatement = (value, cell) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementTypes.cellCreation,
    value,
    cell,
  });
};

export const portCreationStatement = (value, port) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementTypes.portCreation,
    value,
    port,
  });
};

export const portSendStatement = (port, value) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementTypes.portSend,
    port,
    value,
  });
};
