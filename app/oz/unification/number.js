export default (unify, store, equivalenceClassX, equivalenceClassY) => {
  const xValue = equivalenceClassX.getIn(["value", "value"]);
  const yValue = equivalenceClassY.getIn(["value", "value"]);

  if (xValue !== yValue) {
    throw new Error(`Incompatible values ${xValue} and ${yValue}`);
  }

  return store;
};
