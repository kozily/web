import { buildSemanticStatement } from "../machine/build";
import { errorException, raiseSystemException } from "../machine/exceptions";
import { blockCurrentThread } from "../machine/threads";
import { evaluate } from "../expression";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const condition = statement.get("condition");
  const trueStatement = statement.getIn(["trueStatement"]);
  const falseStatement = statement.getIn(["falseStatement"]);

  const evaluation = evaluate(condition, environment, sigma);

  if (evaluation.get("value") === undefined) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      evaluation.get("variable") || evaluation.get("waitCondition"),
    );
  }

  const value = evaluation.get("value");

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
