import Immutable from "immutable";

export default (recurse, literal) => {
  const identifiers = literal
    .getIn(["value", "features"])
    .valueSeq()
    .flatMap(feature => {
      if (feature.get("node") === "identifier") {
        return Immutable.Set(feature.get("identifier"));
      }

      return recurse(feature);
    });

  return Immutable.Set(identifiers);
};
