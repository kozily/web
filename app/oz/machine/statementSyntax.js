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
  operatorSyntax: "operatorSyntax",
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
  return new Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.localSyntax,
    identifiers: identifiers,
    statement,
  });
};

export const bindingStatementSyntax = (lhs, rhs) => {
  return new Immutable.Map({
    node: "statement",
    type: statementSyntaxTypes.bindingSyntax,
    lhs,
    rhs,
  });
};

export const valueCreationStatementSyntax = (lhs, rhs) => {
  return new Immutable.Map({
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
  return new Immutable.Map({
    node: "statement",
    type: statementSyntaxTypes.conditionalSyntax,
    condition,
    trueStatement,
    falseStatement,
  });
};

export const patternMatchingStatementSyntax = (
  identifier,
  pattern,
  trueStatement,
  falseStatement = undefined,
) => {
  return new Immutable.Map({
    node: "statement",
    type: statementSyntaxTypes.patternMatchingSyntax,
    identifier,
    pattern,
    trueStatement,
    falseStatement,
  });
};

export const procedureApplicationStatementSyntax = (procedure, args = []) => {
  return new Immutable.fromJS({
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
  return new Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.exceptionContextSyntax,
    triedStatement,
    exceptionIdentifier,
    exceptionStatement,
  });
};

export const exceptionRaiseStatementSyntax = identifier => {
  return new Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.exceptionRaiseSyntax,
    identifier,
  });
};

export const operatorStatementSyntax = (result, lhs, rhs) => {
  return new Immutable.fromJS({
    node: "statement",
    type: statementSyntaxTypes.operatorSyntax,
    result,
    operator: ".",
    lhs,
    rhs,
  });
};
