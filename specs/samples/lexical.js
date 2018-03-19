import Immutable from "immutable";

export const lexicalIdentifier = identifier => {
  return Immutable.fromJS({
    node: "variable",
    identifier,
  });
};
