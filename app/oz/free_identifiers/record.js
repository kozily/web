import Immutable from "immutable";

export default (recurse, literal) => {
  const features = literal.getIn(["value", "features"]);
  const identifiers = features.valueSeq().map(id => id.get("identifier"));

  return Immutable.Set(identifiers);
};
