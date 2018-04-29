import { blockCurrentThread } from "../machine/threads";
import { lookupMutableMapping, updateMutableMapping } from "../machine/mu";
import { makeNewVariable } from "../machine/sigma";
import { unify } from "../machine/sigma";
import {
  failureException,
  errorException,
  raiseSystemException,
} from "../machine/exceptions";
import { buildEquivalenceClass } from "../machine/build";
import { valueTypes, valueListItem } from "../machine/values";
import { evaluate } from "../expression";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const mu = state.get("mu");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const portExpression = statement.get("port");
  const portEvaluation = evaluate(portExpression, environment, sigma);
  const port = portEvaluation.get("value");

  if (!port) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      portEvaluation.get("waitCondition") || portEvaluation.get("variable"),
    );
  }

  const valueExpression = statement.get("value");
  const valueEvaluation = evaluate(valueExpression, environment, sigma);
  const value = valueEvaluation.get("value");

  if (valueEvaluation.get("waitCondition")) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      valueEvaluation.get("waitCondition"),
    );
  }

  if (port.get("type") !== valueTypes.mutable || port.get("kind") !== "port") {
    return raiseSystemException(state, activeThreadIndex, errorException());
  }

  const currentMapping = lookupMutableMapping(mu, port);
  const currentImmutableVariable = currentMapping.get("immutableVariable");
  const newImmutableVariable = makeNewVariable({
    in: sigma,
    for: currentImmutableVariable.get("name"),
  });
  const newEquivalenceClass = buildEquivalenceClass(
    undefined,
    newImmutableVariable,
  );
  const newMapping = currentMapping.set(
    "immutableVariable",
    newImmutableVariable,
  );

  const newValue = valueListItem(value, newImmutableVariable);

  try {
    return state
      .update("sigma", sigma =>
        unify(
          sigma.add(newEquivalenceClass),
          currentImmutableVariable,
          newValue,
        ),
      )
      .update("mu", mu => updateMutableMapping(mu, newMapping));
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, failureException());
  }
}
