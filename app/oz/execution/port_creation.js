import { blockCurrentThread } from "../machine/threads";
import { makeNewMutableVariable } from "../machine/mu";
import { unify, convertToVariable } from "../machine/sigma";
import { failureException, raiseSystemException } from "../machine/exceptions";
import { buildMutableMapping } from "../machine/build";
import { evaluate } from "../expression";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const mu = state.get("mu");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const valueExpression = statement.get("value");
  const valueEvaluation = evaluate(valueExpression, environment, sigma);

  if (valueEvaluation.get("waitCondition")) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      valueEvaluation.get("waitCondition"),
    );
  }

  const port = statement.get("port");
  const portIdentifier = port.get("identifier");
  const portVariable = environment.get(portIdentifier);

  const mutableVariable = makeNewMutableVariable({ in: mu, for: "port" });

  try {
    const unifiedSigma = unify(sigma, portVariable, mutableVariable);

    const { sigma: finalSigma, variable: valueVariable } = convertToVariable(
      valueEvaluation,
      unifiedSigma,
      "portValue",
    );

    return state
      .set("sigma", finalSigma)
      .update("mu", mu =>
        mu.add(buildMutableMapping(mutableVariable, valueVariable)),
      );
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, failureException());
  }
}
