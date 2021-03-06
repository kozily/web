import { blockCurrentThread } from "../../machine/threads";
import { makeNewMutableVariable } from "../../machine/mu";
import { unify } from "../../machine/sigma";
import {
  failureException,
  raiseSystemException,
} from "../../machine/exceptions";
import { buildMutableMapping } from "../../machine/build";
import { evaluate } from "../../evaluation";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const mu = state.get("mu");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const value = statement.get("value");
  const valueIdentifier = value.get("identifier");
  const valueVariable = environment.get(valueIdentifier);

  const portExpression = statement.get("port");
  const portEvaluation = evaluate(portExpression, environment, sigma);

  if (portEvaluation.get("waitCondition")) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      portEvaluation.get("waitCondition"),
    );
  }

  const mutableVariable = makeNewMutableVariable({ in: mu, for: "port" });

  try {
    const unifiedSigma = unify(sigma, portEvaluation, mutableVariable);

    return state
      .set("sigma", unifiedSigma)
      .update("mu", mu =>
        mu.add(buildMutableMapping(mutableVariable, valueVariable)),
      );
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, failureException());
  }
}
