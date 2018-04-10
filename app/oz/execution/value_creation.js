import { makeNewVariable, unify, createValue } from "../machine/sigma";
import {
  buildEquivalenceClass,
  makeAuxiliaryIdentifier,
} from "../machine/build";
import { failureException, raiseSystemException } from "../machine/exceptions";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const identifier = statement.getIn(["lhs", "identifier"]);
  const variable = environment.get(identifier);

  const literal = statement.get("rhs");
  const sigmaValue = createValue(environment, literal);

  const aux = makeAuxiliaryIdentifier();
  const newVariable = makeNewVariable({
    in: state.get("sigma"),
    for: aux.get("identifier"),
  });
  const newEquivalenceClass = buildEquivalenceClass(sigmaValue, newVariable);
  const newSigma = sigma.add(newEquivalenceClass);
  try {
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
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, failureException());
  }
}
