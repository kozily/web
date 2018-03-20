export default (environment, literal) => {
  return literal.delete("node").updateIn(["value", "features"], features => {
    return features.map(feature => {
      const identifier = feature.get("identifier");
      return environment.get(identifier);
    });
  });
};
