import Immutable from "immutable";
import { buildSemanticStatement } from "../machine/build";
import { blockCurrentThread } from "../machine/threads";
import { evaluate } from "../expression";
import {
  getLastEnvironmentIndex,
  makeEnvironmentIndex,
} from "../machine/environment";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");
  const lastIndex = getLastEnvironmentIndex();

  const identifier = statement.get("identifier");
  const pattern = statement.getIn(["pattern"]);
  const trueStatement = statement.getIn(["trueStatement"]);
  const falseStatement = statement.getIn(["falseStatement"]);

  const evaluation = evaluate(identifier, environment, sigma);

  if (evaluation.get("value") === undefined) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      evaluation.get("variable") || evaluation.get("waitCondition"),
    );
  }

  const value = evaluation.get("value");

  if (
    value.get("type") === "record" &&
    value.getIn(["value", "label"]) === pattern.getIn(["value", "label"])
  ) {
    const valueFeatures = value.getIn(["value", "features"]);
    const patternFeatures = pattern.getIn(["value", "features"]);

    if (
      Immutable.is(
        valueFeatures.keySeq().toSet(),
        patternFeatures.keySeq().toSet(),
      )
    ) {
      const newIndex = makeEnvironmentIndex();
      const newEnvironment = patternFeatures.reduce(
        (result, identifier, feature) => {
          return result.set(
            identifier.get("identifier"),
            valueFeatures.get(feature),
          );
        },
        environment,
      );

      return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
        stack.push(
          buildSemanticStatement(trueStatement, newEnvironment, {
            environmentIndex: newIndex,
          }),
        ),
      );
    }
  }

  return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
    stack.push(
      buildSemanticStatement(falseStatement, environment, {
        environmentIndex: lastIndex,
      }),
    ),
  );
}
