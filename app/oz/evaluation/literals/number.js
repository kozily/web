import Immutable from "immutable";
import { valueNumber } from "../../machine/values";

export default (recurse, literal) => {
  const value = valueNumber(literal.get("value"));

  return Immutable.fromJS({
    value,
  });
};
