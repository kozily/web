export default (unify, sigma, equivalenceClassX, equivalenceClassY) => {
  const xValue = equivalenceClassX.getIn(["value", "value"]);
  const yValue = equivalenceClassY.getIn(["value", "value"]);

  if (xValue !== yValue) {
    throw new Error(`Incompatible values ${xValue} and ${yValue}`);
  }

  return sigma;
};
