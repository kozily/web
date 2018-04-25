import { lookupVariableInSigma, evaluationToVariable } from "../machine/sigma";
import { identifierExpression } from "../machine/expressions";
import { lexicalIdentifier } from "../machine/lexical";
import {
  buildThread,
  buildSemanticStatement,
  buildTrigger,
  buildEnvironment,
} from "../machine/build";
import { procedureApplicationStatement } from "../machine/statements";
import { blockCurrentThread } from "../machine/threads";
import { evaluate } from "../expression";
import { makeEnvironmentIndex } from "../machine/environment";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const procedure = statement.get("procedure");
  const evaluation = evaluate(procedure, environment, sigma);

  if (evaluation.get("waitCondition")) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      evaluation.get("waitCondition"),
    );
  }

  const {
    sigma: augmentedSigma,
    variable: procedureVariable,
  } = evaluationToVariable(evaluation, sigma, "triggerProcedure");

  const needed = statement.get("neededIdentifier");
  const neededIdentifier = needed.get("identifier");
  const neededVariable = environment.get(neededIdentifier);
  const neededEquivalenceClass = lookupVariableInSigma(
    augmentedSigma,
    neededVariable,
  );

  if (neededEquivalenceClass.get("value")) {
    const newStatement = procedureApplicationStatement(
      identifierExpression(lexicalIdentifier("TriggerProcedure")),
      [identifierExpression(needed)],
    );
    const newIndex = makeEnvironmentIndex();
    const newThread = buildThread({
      semanticStatements: [
        buildSemanticStatement(
          newStatement,
          buildEnvironment({
            TriggerProcedure: procedureVariable,
            [neededIdentifier]: neededVariable,
          }),
          { environmentIndex: newIndex },
        ),
      ],
    });

    return state
      .update("threads", threads => threads.push(newThread))
      .set("sigma", augmentedSigma);
  }

  const newTrigger = buildTrigger(
    procedureVariable,
    "TriggerProcedure",
    neededVariable,
    neededIdentifier,
  );

  return state
    .update("tau", tau => tau.add(newTrigger))
    .set("sigma", augmentedSigma);
}
