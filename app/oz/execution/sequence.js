import { buildSemanticStatement } from "../machine/build";

export default function(state, semanticStatement) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");
  const head = statement.get("head");
  const tail = statement.get("tail");

  return state.update("stack", stack =>
    stack.push(
      buildSemanticStatement(head, environment),
      buildSemanticStatement(tail, environment),
    ),
  );
}
