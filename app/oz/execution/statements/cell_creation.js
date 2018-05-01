import { blockCurrentThread } from "../../machine/threads";
import { makeNewMutableVariable } from "../../machine/mu";
import { unify, convertToVariable } from "../../machine/sigma";
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

  const cell = statement.get("cell");
  const cellIdentifier = cell.get("identifier");
  const cellVariable = environment.get(cellIdentifier);

  const mutableVariable = makeNewMutableVariable({ in: mu, for: "cell" });

  try {
    const unifiedSigma = unify(sigma, cellVariable, mutableVariable);

    const { sigma: finalSigma, variable: valueVariable } = convertToVariable(
      valueEvaluation,
      unifiedSigma,
      "cellValue",
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
