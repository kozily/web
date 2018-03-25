import { makeNewVariable, unify, createValue } from "../machine/sigma";
import { buildEquivalenceClass } from "../machine/build";

export default function(state, semanticStatement) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const identifier = statement.getIn(["lhs", "identifier"]);
  const variable = environment.get(identifier);

  const literal = statement.get("rhs");
  const sigmaValue = createValue(environment, literal);

  const newVariable = makeNewVariable({
    in: state.get("sigma"),
    for: "__VALUE_CREATION__",
  });
  const newEquivalenceClass = buildEquivalenceClass(sigmaValue, newVariable);
  const newSigma = sigma.add(newEquivalenceClass);
  const unifiedSigma = unify(newSigma, variable, newVariable);

  const resultingEquivalenceClass = unifiedSigma.find(x =>
    x.get("variables").contains(newVariable),
  );

  const cleanUnifiedSigma = unifiedSigma
    .delete(resultingEquivalenceClass)
    .add(
      resultingEquivalenceClass.update("variables", variables =>
        variables.delete(newVariable),
      ),
    );

  return state.set("sigma", cleanUnifiedSigma);
}
