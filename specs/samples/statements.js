import Immutable from "immutable";

export const sequenceStatement = (head, tail) => {
  return Immutable.fromJS({
    node: "statement",
    type: "sequence",
    head,
    tail,
  });
};

export const skipStatement = () => {
  return Immutable.fromJS({
    node: "statement",
    type: "skip",
  });
};

export const localStatement = (identifier, statement) => {
  return new Immutable.Map({
    node: "statement",
    type: "local",
    identifier,
    statement,
  });
};

export const bindingStatement = (lhs, rhs) => {
  return new Immutable.Map({
    node: "statement",
    type: "binding",
    lhs,
    rhs,
  });
};

export const valueCreationStatement = (lhs, rhs) => {
  return new Immutable.Map({
    node: "statement",
    type: "valueCreation",
    lhs,
    rhs,
  });
};

export const conditionalStatement = (
  condition,
  true_statement,
  false_statement = undefined,
) => {
  return new Immutable.Map({
    node: "statement",
    type: "conditional",
    condition,
    true_statement,
    false_statement,
  });
};

export const patternMatchingStatement = (
  identifier,
  pattern,
  true_statement,
  false_statement = undefined,
) => {
  return new Immutable.Map({
    node: "statement",
    type: "patternMatching",
    identifier,
    pattern,
    true_statement,
    false_statement,
  });
};

export const procedureApplicationStatement = (procedure, args = []) => {
  return new Immutable.fromJS({
    node: "statement",
    type: "procedureApplication",
    procedure,
    args,
  });
};

export const exceptionContextStatement = (
  triedStatement,
  exceptionIdentifier,
  exceptionStatement,
) => {
  return new Immutable.fromJS({
    node: "statement",
    type: "exceptionContext",
    triedStatement,
    exceptionIdentifier,
    exceptionStatement,
  });
};

export const exceptionRaiseStatement = identifier => {
  return new Immutable.fromJS({
    node: "statement",
    type: "exceptionRaise",
    identifier,
  });
};

export const exceptionCatchStatement = (
  exceptionIdentifier,
  exceptionStatement,
) => {
  return new Immutable.fromJS({
    node: "statement",
    type: "exceptionCatch",
    exceptionIdentifier,
    exceptionStatement,
  });
};
