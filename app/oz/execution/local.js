import {
  buildEquivalenceClass,
  buildSemanticStatement,
} from "../machine/build";
import { makeNewVariable } from "../machine/store";

export default function(state, semanticStatement) {
  const identifier = semanticStatement.getIn([
    "statement",
    "identifier",
    "identifier",
  ]);
  const childStatement = semanticStatement.getIn(["statement", "statement"]);

  const newVariable = makeNewVariable({
    in: state.get("store"),
    for: identifier,
  });
  const newEquivalenceClass = buildEquivalenceClass(undefined, newVariable);
  const newEnvironment = semanticStatement
    .get("environment")
    .set(identifier, newVariable);
  const newSemanticStatement = buildSemanticStatement(
    childStatement,
    newEnvironment,
  );

  return state
    .update("store", store => store.add(newEquivalenceClass))
    .update("stack", stack => stack.push(newSemanticStatement));
}
