import Immutable from "immutable";

export default (unify, store, equivalenceClassX, equivalenceClassY) => {
  const xValue = equivalenceClassX.getIn(["value", "value"]);
  const yValue = equivalenceClassY.getIn(["value", "value"]);

  const xLabel = xValue.get("label");
  const yLabel = yValue.get("label");
  if (xLabel !== yLabel) {
    throw new Error(`Incompatible labels ${xLabel} and ${yLabel}`);
  }

  const xFeatures = new Immutable.Set(xValue.get("features").keySeq());
  const yFeatures = new Immutable.Set(yValue.get("features").keySeq());

  if (!Immutable.is(xFeatures, yFeatures)) {
    throw new Error(
      `Incompatible features ${xFeatures.toJSON()} and ${yFeatures.toJSON()}`,
    );
  }

  return xFeatures.reduce((updatedStore, feature) => {
    const xVariable = xValue.getIn(["features", feature]);
    const yVariable = yValue.getIn(["features", feature]);

    return unify(updatedStore, xVariable, yVariable);
  }, store);
};
