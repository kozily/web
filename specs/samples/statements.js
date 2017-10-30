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
