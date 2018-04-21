import Immutable from "immutable";
import { lookupVariableInSigma } from "../machine/sigma";

export default (recurse, args, sigma) => {
  const lhs = args.getIn([0, "value", "value"]);
  const rhs = args.getIn([1, "value", "value"]);
  if (lhs.get("label") !== rhs.get("label")) {
    return Immutable.Map({ value: false });
  }

  const lhsFeatures = Immutable.Set(lhs.get("features").keySeq());
  const rhsFeatures = Immutable.Set(rhs.get("features").keySeq());

  if (!Immutable.is(lhsFeatures, rhsFeatures)) {
    return Immutable.Map({ value: false });
  }

  const valuePairs = lhsFeatures.map(x => [
    lhs.getIn(["features", x]),
    rhs.getIn(["features", x]),
  ]);

  const reduction = valuePairs.reduce((result, [lhsVariable, rhsVariable]) => {
    if (result) {
      return result;
    }

    if (Immutable.is(lhsVariable, rhsVariable)) {
      return Immutable.Map({ value: true });
    }
    const lhsValue = lookupVariableInSigma(sigma, lhsVariable).get("value");
    const rhsValue = lookupVariableInSigma(sigma, rhsVariable).get("value");
    const recursiveEntailment = recurse(
      Immutable.fromJS([
        { value: lhsValue, variable: lhsVariable },
        { value: rhsValue, variable: rhsVariable },
      ]),
      sigma,
    );

    if (recursiveEntailment.get("waitCondition")) {
      return Immutable.Map({
        waitCondition: recursiveEntailment.get("waitCondition"),
      });
    }
    if (recursiveEntailment.get("value") === false) {
      return Immutable.Map({ value: false });
    }
    return result;
  }, false);

  if (reduction) {
    return reduction;
  }

  return Immutable.Map({ value: true });
};
