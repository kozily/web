import { lookupVariableInSigma } from "../machine/sigma";
import { buildSemanticStatement } from "../machine/build";
import { errorException, raiseSystemException } from "../machine/exceptions";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const identifier = statement.getIn(["condition", "identifier"]);
  const trueStatement = statement.getIn(["trueStatement"]);
  const falseStatement = statement.getIn(["falseStatement"]);

  const variable = environment.get(identifier);
  const equivalentClass = lookupVariableInSigma(sigma, variable);

  const value = equivalentClass.get("value");

  if (value === undefined) {
    return state
      .setIn(["threads", activeThreadIndex, "metadata", "status"], "blocked")
      .updateIn(["threads", activeThreadIndex, "stack"], stack =>
        stack.push(semanticStatement),
      );
  }

  if (value.get("type") !== "record")
    return raiseSystemException(state, activeThreadIndex, errorException());

  if (!value.getIn(["value", "features"]).isEmpty())
    return raiseSystemException(state, activeThreadIndex, errorException());

  const label = value.getIn(["value", "label"]);

  if (label !== "true" && label !== "false")
    return raiseSystemException(state, activeThreadIndex, errorException());

  if (label === "true") {
    const newSemanticStatement = buildSemanticStatement(
      trueStatement,
      environment,
    );
    return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(newSemanticStatement),
    );
  } else {
    const newSemanticStatement = buildSemanticStatement(
      falseStatement,
      environment,
    );
    return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(newSemanticStatement),
    );
  }
}
