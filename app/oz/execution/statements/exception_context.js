import { buildSemanticStatement } from "../../machine/build";
import { exceptionCatchStatement } from "../../machine/statements";

export default function(state, semanticStatement, activeThreadIndex) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const triedStatement = statement.get("triedStatement");
  const catchStatement = exceptionCatchStatement(
    statement.get("exceptionIdentifier"),
    statement.get("exceptionStatement"),
  );

  return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
    stack
      .push(buildSemanticStatement(catchStatement, environment))
      .push(buildSemanticStatement(triedStatement, environment)),
  );
}
