import { lookupVariableInSigma } from "../machine/sigma";
import { buildSemanticStatement } from "../machine/build";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const callIdentifier = statement.getIn(["procedure", "identifier"]);
  const callArguments = statement.get("args").map(x => x.get("identifier"));

  const variable = environment.get(callIdentifier);
  const equivalenceClass = lookupVariableInSigma(sigma, variable);

  const procedureValue = equivalenceClass.get("value");

  if (procedureValue === undefined) {
    return state
      .setIn(["threads", activeThreadIndex, "metadata", "status"], "blocked")
      .updateIn(["threads", activeThreadIndex, "stack"], stack =>
        stack.push(semanticStatement),
      );
  }

  if (procedureValue.get("type") !== "procedure")
    throw new Error(
      `Wrong type in procedure application, trying to call a ${procedureValue.get(
        "type",
      )}`,
    );

  const declaredArguments = procedureValue
    .getIn(["value", "args"])
    .map(x => x.get("identifier"));

  if (declaredArguments.count() !== callArguments.count())
    throw new Error(
      `Wrong number of arguments in procedure application, declared arguments ${declaredArguments
        .toJS()
        .join(",")}, applying arguments ${callArguments.toJS().join(", ")}`,
    );

  const contextualEnvironment = procedureValue.getIn(["value", "context"]);
  const newEnvironment = callArguments
    .zip(declaredArguments)
    .reduce((accumulator, pair) => {
      return accumulator.set(pair[1], environment.get(pair[0]));
    }, contextualEnvironment);

  const procedureBody = procedureValue.getIn(["value", "body"]);

  const newStatement = buildSemanticStatement(procedureBody, newEnvironment);

  return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
    stack.push(newStatement),
  );
}
