import Immutable from "immutable";
import { statementTypes } from "../../machine/statements";
import { buildSemanticStatement } from "../../machine/build";
import { getLastEnvironmentIndex } from "../../machine/environment";

const collectStatements = statement => {
  if (statement.get("type") !== statementTypes.sequence) {
    return Immutable.List.of(statement);
  }
  const head = Immutable.List.of(statement.get("head"));
  const tail = collectStatements(statement.get("tail"));
  return head.concat(tail);
};

export default function(state, semanticStatement, activeThreadIndex) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");
  const environmentIndex = getLastEnvironmentIndex();

  const semanticStatements = collectStatements(statement).map(s =>
    buildSemanticStatement(s, environment, environmentIndex),
  );

  return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
    stack.pushAll(semanticStatements),
  );
}
