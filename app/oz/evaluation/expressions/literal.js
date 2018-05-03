export default (recurse, expression, environment, sigma) => {
  const literal = expression.get("literal");
  return recurse(literal, environment, sigma);
};
