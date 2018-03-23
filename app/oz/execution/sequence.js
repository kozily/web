import { buildSemanticStatement } from "../machine/build";

export default function(state, semanticStatement, activeThreadIndex) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");
  const head = statement.get("head");
  const tail = statement.get("tail");

  return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
    stack.push(
      buildSemanticStatement(head, environment),
      buildSemanticStatement(tail, environment),
    ),
  );
}
