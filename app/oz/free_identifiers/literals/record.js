import Immutable from "immutable";

export default (recurse, literal) => {
  const identifiers = literal
    .getIn(["value", "features"])
    .valueSeq()
    .flatMap(feature => {
      return recurse(feature);
    });

  return Immutable.Set(identifiers);
};
