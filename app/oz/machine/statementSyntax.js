import Immutable from "immutable";

export const statementSyntaxTypes = {
  skipSyntax: "skipSyntax",
  sequenceSyntax: "sequenceSyntax",
  localSyntax: "localSyntax",
  bindingSyntax: "bindingSyntax",
  valueCreationSyntax: "valueCreationSyntax",
  conditionalSyntax: "conditionalSyntax",
  patternMatchingSyntax: "patternMatchingSyntax",
  procedureApplicationSyntax: "procedureApplicationSyntax",
  exceptionContextSyntax: "exceptionContextSyntax",
  exceptionRaiseSyntax: "exceptionRaiseSyntax",
  threadSyntax: "threadSyntax",
  byNeedSyntax: "byNeedSyntax",
  cellCreationSyntax: "cellCreationSyntax",
  portCreationSyntax: "portCreationSyntax",
  portSendSyntax: "portSendSyntax",
};

export const allStatementSyntaxTypes = Object.keys(statementSyntaxTypes);

export const sequenceStatementSyntax = (head, tail) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.sequenceSyntax,
    head,
    tail,
  });
};

export const skipStatementSyntax = () => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.skipSyntax,
  });
};

export const localStatementSyntax = (identifiers, statement) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.localSyntax,
    identifiers: identifiers,
    statement,
  });
};

export const bindingStatementSyntax = (lhs, rhs) => {
  return Immutable.Map({
    node: "statement",
    type: statementSyntaxTypes.bindingSyntax,
    lhs,
    rhs,
  });
};

export const valueCreationStatementSyntax = (lhs, rhs) => {
  return Immutable.Map({
    node: "statement",
    type: statementSyntaxTypes.valueCreationSyntax,
    lhs,
    rhs,
  });
};

export const conditionalStatementSyntax = (
  condition,
  trueStatement,
  falseStatement = undefined,
) => {
  return Immutable.Map({
    node: "statement",
    type: statementSyntaxTypes.conditionalSyntax,
    condition,
    trueStatement,
    falseStatement,
  });
};

export const patternMatchingStatementSyntax = (
  identifier,
  clauses,
  falseStatement = undefined,
) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.patternMatchingSyntax,
    identifier,
    clauses,
    falseStatement,
  });
};

export const procedureApplicationStatementSyntax = (procedure, args = []) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.procedureApplicationSyntax,
    procedure,
    args,
  });
};

export const exceptionContextStatementSyntax = (
  triedStatement,
  exceptionIdentifier,
  exceptionStatement,
) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.exceptionContextSyntax,
    triedStatement,
    exceptionIdentifier,
    exceptionStatement,
  });
};

export const exceptionRaiseStatementSyntax = identifier => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.exceptionRaiseSyntax,
    identifier,
  });
};

export const threadStatementSyntax = body => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.threadSyntax,
    body,
  });
};

export const byNeedStatementSyntax = (procedure, neededIdentifier) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.byNeedSyntax,
    procedure,
    neededIdentifier,
  });
};

export const cellCreationStatementSyntax = (value, cell) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.cellCreationSyntax,
    value,
    cell,
  });
};

export const portCreationStatementSyntax = (value, port) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.portCreationSyntax,
    value,
    port,
  });
};

export const portSendStatementSyntax = (port, value) => {
  return Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.portSendSyntax,
    port,
    value,
  });
};
