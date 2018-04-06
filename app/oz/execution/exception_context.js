import Immutable from "immutable";
import { buildSemanticStatement } from "../machine/build";

export default function(state, semanticStatement, activeThreadIndex) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const triedStatement = statement.get("triedStatement");
  const catchStatement = Immutable.fromJS({
    node: "statement",
    type: "exceptionCatch",
    exceptionIdentifier: statement.get("exceptionIdentifier"),
    exceptionStatement: statement.get("exceptionStatement"),
  });

  return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
    stack
      .push(buildSemanticStatement(catchStatement, environment))
      .push(buildSemanticStatement(triedStatement, environment)),
  );
}
