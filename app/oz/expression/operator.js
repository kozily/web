import Immutable from "immutable";
import { namespacedBuiltIns } from "../built_ins";

export default (recurse, expression, environment, sigma) => {
  const operator = expression.get("operator");

  const lhsEvaluation = recurse(expression.get("lhs"), environment, sigma);
  const rhsEvaluation = recurse(expression.get("rhs"), environment, sigma);
  const argsEvaluations = Immutable.List([lhsEvaluation, rhsEvaluation]);

  const waitingEvaluation = argsEvaluations.find(x => x.get("waitCondition"));
  if (waitingEvaluation) {
    return waitingEvaluation;
  }

  for (let namespaceKey in namespacedBuiltIns) {
    const namespace = namespacedBuiltIns[namespaceKey];
    if (namespace[operator]) {
      return namespace[operator].evaluate(argsEvaluations, sigma);
    }
  }
};
