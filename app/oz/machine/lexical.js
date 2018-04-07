import Immutable from "immutable";

export const lexicalIdentifier = identifier => {
  return Immutable.fromJS({
    node: "identifier",
    identifier,
  });
};

export const lexicalRecordSelection = (identifier, feature) => {
  return Immutable.fromJS({
    node: "recordSelection",
    identifier,
    feature,
  });
};
