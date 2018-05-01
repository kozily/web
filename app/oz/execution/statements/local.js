import {
  buildEquivalenceClass,
  buildSemanticStatement,
} from "../../machine/build";
import { makeNewVariable } from "../../machine/sigma";
import { makeNewEnvironmentIndex } from "../../machine/environment";

export default function(state, semanticStatement, activeThreadIndex) {
  const identifier = semanticStatement.getIn([
    "statement",
    "identifier",
    "identifier",
  ]);
  const childStatement = semanticStatement.getIn(["statement", "statement"]);

  const newVariable = makeNewVariable({
    in: state.get("sigma"),
    for: identifier,
  });
  const newEquivalenceClass = buildEquivalenceClass(undefined, newVariable);
  const newEnvironment = semanticStatement
    .get("environment")
    .set(identifier, newVariable);
  const newIndex = makeNewEnvironmentIndex();
  const newSemanticStatement = buildSemanticStatement(
    childStatement,
    newEnvironment,
    { environmentIndex: newIndex },
  );

  return state
    .update("sigma", sigma => sigma.add(newEquivalenceClass))
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(newSemanticStatement),
    );
}
