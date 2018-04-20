import Immutable from "immutable";
import { builtIns } from "../machine/built_ins";

export default (recurse, expression, environment, sigma) => {
  const operator = expression.get("operator");

  const lhsEvaluation = recurse(expression.get("lhs"), environment, sigma);
  if (lhsEvaluation.waitCondition) {
    return { waitCondition: lhsEvaluation.waitCondition };
  }
  const rhsEvaluation = recurse(expression.get("rhs"), environment, sigma);
  if (rhsEvaluation.waitCondition) {
    return { waitCondition: rhsEvaluation.waitCondition };
  }

  const evaluations = Immutable.List([lhsEvaluation, rhsEvaluation]);
  const args = evaluations.map(x => x.value);

  for (let namespaceKey in builtIns) {
    const namespace = builtIns[namespaceKey];
    if (namespace[operator]) {
      const evaluation = namespace[operator].evaluate(args, sigma);
      if (evaluation.missingArg !== undefined) {
        return {
          waitCondition: evaluations.get(evaluation.missingArg).variable,
        };
      }

      return evaluation;
    }
  }
};
