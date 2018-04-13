import { lookupVariableInSigma } from "../machine/sigma";
import {
  buildThread,
  buildSemanticStatement,
  buildTrigger,
} from "../machine/build";
import { procedureApplicationStatement } from "../machine/statements";

export default function(state, semanticStatement) {
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const procedure = statement.get("procedure");
  const procedureIdentifier = procedure.get("identifier");
  const procedureVariable = environment.get(procedureIdentifier);

  const needed = statement.get("neededIdentifier");
  const neededIdentifier = needed.get("identifier");
  const neededVariable = environment.get(neededIdentifier);
  const neededEquivalenceClass = lookupVariableInSigma(
    state.get("sigma"),
    neededVariable,
  );

  if (neededEquivalenceClass.get("value")) {
    const newStatement = procedureApplicationStatement(procedure, [needed]);
    const newThread = buildThread({
      semanticStatements: [buildSemanticStatement(newStatement, environment)],
    });

    return state.update("threads", threads => threads.push(newThread));
  }

  const newTrigger = buildTrigger(procedureVariable, neededVariable);

  return state.update("tau", tau => tau.add(newTrigger));
}
