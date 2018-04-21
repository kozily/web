import Immutable from "immutable";
import { lookupVariableInSigma } from "../machine/sigma";

export default (recurse, expression, environment, sigma) => {
  const identifier = expression.getIn(["identifier", "identifier"]);
  const variable = environment.get(identifier);
  const equivalenceClass = lookupVariableInSigma(sigma, variable);
  const value = equivalenceClass.get("value");

  return Immutable.Map({
    value,
    variable,
  });
};
