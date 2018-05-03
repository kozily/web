export default (recurse, node) => {
  const features = node.getIn(["value", "features"]);
  const featureCompilations = features.map(feature => recurse(feature));
  const resultingFeatures = featureCompilations.map(
    compilation => compilation.resultingExpression,
  );

  const resultingExpression = node.setIn(
    ["value", "features"],
    resultingFeatures,
  );

  const augmentStatement = featureCompilations
    .valueSeq()
    .map(compilation => compilation.augmentStatement)
    .reduce((result, f) => statement => result(f(statement)), x => x);

  return { resultingExpression, augmentStatement };
};
