import { buildSemanticStatement } from "../machine/build";
import { blockCurrentThread } from "../machine/threads";
import { evaluate } from "../expression";
import { patternMatch } from "../pattern_match";
import {
  getLastEnvironmentIndex,
  makeNewEnvironmentIndex,
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

  const { match, additionalBindings, sigma: augmentedSigma } = patternMatch(
    evaluation,
    pattern,
    sigma,
  );

  if (match) {
    const newSemanticStatement = additionalBindings.isEmpty()
      ? buildSemanticStatement(trueStatement, environment)
      : buildSemanticStatement(
          trueStatement,
          environment.merge(additionalBindings),
          { environmentIndex: makeNewEnvironmentIndex() },
        );
    return state
      .updateIn(["threads", activeThreadIndex, "stack"], stack =>
        stack.push(newSemanticStatement),
      )
      .set("sigma", augmentedSigma);
  }

  const newSemanticStatement = buildSemanticStatement(
    falseStatement,
    environment,
    { environmentIndex: lastIndex },
  );
  return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
    stack.push(newSemanticStatement),
  );
}
