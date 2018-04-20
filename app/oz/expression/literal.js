import { createValue } from "../value_creation";

export default (recurse, expression, environment) => {
  const literal = expression.get("literal");
  const value = createValue(environment, literal);

  return {
    value,
  };
};
