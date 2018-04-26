export default (recurse, environment, literal) => {
  return literal
    .set("node", "value")
    .updateIn(["value", "features"], features => {
      return features.map(feature => {
        if (feature.get("node") === "identifier") {
          const identifier = feature.get("identifier");
          return environment.get(identifier);
        }

        return recurse(environment, feature);
      });
    });
};
