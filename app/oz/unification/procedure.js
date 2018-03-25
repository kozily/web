import Immutable from "immutable";

export default (unify, store, equivalenceClassX, equivalenceClassY) => {
  const xValue = equivalenceClassX.getIn(["value", "value"]);
  const yValue = equivalenceClassY.getIn(["value", "value"]);

  if (!Immutable.is(xValue, yValue)) {
    throw new Error(`Incompatible procedure values`);
  }

  return store;
};
