import Immutable from "immutable";
import { builtIns } from "../machine/built_ins";

export default (recurse, expression, environment, sigma) => {
  const lhsValue = recurse(expression.get("lhs"), environment, sigma).value;
  const rhsValue = recurse(expression.get("rhs"), environment, sigma).value;
  const args = Immutable.List([lhsValue, rhsValue]);

  const operator = expression.get("operator");

  for (let namespaceKey in builtIns) {
    const namespace = builtIns[namespaceKey];

    if (namespace[operator]) {
      return namespace[operator].evaluate(args, sigma);
    }
  }
};
