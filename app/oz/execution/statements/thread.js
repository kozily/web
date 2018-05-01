import { buildThread, buildSemanticStatement } from "../../machine/build";

export default function(state, semanticStatement) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const newThread = buildThread({
    semanticStatements: [
      buildSemanticStatement(statement.get("body"), environment),
    ],
  });

  return state.update("threads", threads => threads.push(newThread));
}
