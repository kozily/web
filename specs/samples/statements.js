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

export const localStatement = (variable, statement) => {
  return new Immutable.Map({
    node: "statement",
    type: "local",
    variable,
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
  variable,
  pattern,
  true_statement,
  false_statement = undefined,
) => {
  return new Immutable.Map({
    node: "statement",
    type: "patternMatching",
    variable,
    pattern,
    true_statement,
    false_statement,
  });
};
