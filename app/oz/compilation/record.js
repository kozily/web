export default (recurse, node) => {
  return node.updateIn(["value", "features"], features => {
    return features.map(feature => {
      if (feature.get("node") !== "identifier") {
        return recurse(feature);
      }

      return feature;
    });
  });
};
