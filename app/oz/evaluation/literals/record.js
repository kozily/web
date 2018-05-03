import Immutable from "immutable";
import { valueRecord } from "../../machine/values";

export default (recurse, literal, environment, sigma) => {
  const label = literal.getIn(["value", "label"]);
  const features = literal.getIn(["value", "features"]);

  const evaluatedFeatures = features.map(feature =>
    recurse(feature, environment, sigma),
  );
  const blockedFeature = evaluatedFeatures.find(evaluation =>
    evaluation.get("waitCondition"),
  );

  if (blockedFeature) {
    return blockedFeature;
  }

  const finalFeatures = evaluatedFeatures.map(
    evaluation => evaluation.get("variable") || evaluation.get("value"),
  );

  const value = valueRecord(label, finalFeatures);

  return Immutable.fromJS({
    value,
  });
};
