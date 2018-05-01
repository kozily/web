import Immutable from "immutable";

export default (unify, sigma, equivalenceClassX, equivalenceClassY) => {
  const xValue = equivalenceClassX.get("value");
  const yValue = equivalenceClassY.get("value");

  if (!Immutable.is(xValue, yValue)) {
    throw new Error(`Incompatible name values`);
  }

  return sigma;
};
