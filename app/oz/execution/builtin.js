import {
  makeNewVariable,
  lookupVariableInSigma,
  unify,
} from "../machine/sigma";
import {
  makeAuxiliaryIdentifier,
  buildEquivalenceClass,
} from "../machine/build";
import { builtIns } from "../machine/builtIns";

export const newSigmaAfterBuiltIn = (
  sigma,
  namespace,
  operator,
  argumentValues,
  resultVariable,
) => {
  const builtIn = builtIns[namespace][operator];
  if (builtIn === undefined) {
    throw new Error("Builtin operation is not defined");
  }
  const value = builtIn.handler(argumentValues);
  const aux = makeAuxiliaryIdentifier();
  const newVariable = makeNewVariable({
    in: sigma,
    for: aux.get("identifier"),
  });
  const newEquivalenceClass = buildEquivalenceClass(value, newVariable);
  const newSigma = sigma.add(newEquivalenceClass);

  const unifiedSigma = unify(newSigma, resultVariable, newVariable);
  const resultingEquivalenceClass = lookupVariableInSigma(
    unifiedSigma,
    newVariable,
  );
  const cleanUnifiedSigma = unifiedSigma
    .delete(resultingEquivalenceClass)
    .add(
      resultingEquivalenceClass.update("variables", variables =>
        variables.delete(newVariable),
      ),
    );

  return cleanUnifiedSigma;
};
