import { blockCurrentThread } from "../../machine/threads";
import { valueTypes } from "../../machine/values";
import { updateMutableMapping, lookupMutableMapping } from "../../machine/mu";
import { unify, convertToVariable } from "../../machine/sigma";
import {
  errorException,
  failureException,
  raiseSystemException,
} from "../../machine/exceptions";
import { evaluate } from "../../evaluation";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const mu = state.get("mu");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const cellExpression = statement.get("cell");
  const cellEvaluation = evaluate(cellExpression, environment, sigma);
  const cell = cellEvaluation.get("value");

  if (!cell) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      cellEvaluation.get("waitCondition") || cellEvaluation.get("variable"),
    );
  }

  const currentValue = statement.get("current");
  const currentValueIdentifier = currentValue.get("identifier");

  const nextValueExpression = statement.get("next");
  const nextValueEvaluation = evaluate(nextValueExpression, environment, sigma);

  if (nextValueEvaluation.get("waitCondition")) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      nextValueEvaluation.get("waitCondition"),
    );
  }

  if (cell.get("type") !== valueTypes.mutable || cell.get("kind") !== "cell") {
    return raiseSystemException(state, activeThreadIndex, errorException());
  }

  const currentMapping = lookupMutableMapping(mu, cell);
  const currentImmutableVariable = currentMapping.get("immutableVariable");

  const {
    sigma: sigmaWithNextValue,
    variable: nextImmutableVariable,
  } = convertToVariable(nextValueEvaluation, sigma, "cellValue");

  const nextMapping = currentMapping.set(
    "immutableVariable",
    nextImmutableVariable,
  );

  try {
    const unifiedSigma =
      currentValueIdentifier === "_"
        ? sigmaWithNextValue
        : unify(
            sigmaWithNextValue,
            environment.get(currentValueIdentifier),
            currentImmutableVariable,
          );
    const updatedMu = updateMutableMapping(mu, nextMapping);

    return state.set("sigma", unifiedSigma).set("mu", updatedMu);
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, failureException());
  }
}
