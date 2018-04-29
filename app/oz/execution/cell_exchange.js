// import { blockCurrentThread } from "../machine/threads";
// import { updateMutableVariable } from "../machine/mu";
// import { unify, convertToVariable } from "../machine/sigma";
// import { failureException, raiseSystemException } from "../machine/exceptions";
// import { buildMutableMapping } from "../machine/build";
// import { evaluate } from "../expression";

export default function(state) {
  return state;
  // const sigma = state.get("sigma");
  // const mu = state.get("mu");
  // const statement = semanticStatement.get("statement");
  // const environment = semanticStatement.get("environment");

  // const cellExpression = statement.get("cell");
  // const cellEvaluation = evaluate(cellExpression, environment, sigma);

  // if (!cellEvaluation.get("value")) {
  //   return blockCurrentThread(
  //     state,
  //     semanticStatement,
  //     activeThreadIndex,
  //     cellEvaluation.get("waitCondition") || cellEvaluation.get("variable"),
  //   );
  // }

  // const currentValue = statement.get("current");
  // const currentValueIdentifier = currentValue.get("identifier");
  // const currentValueVariable = environment.get(currentValueIdentifier);

  // const nextValueExpression = statement.get("next");
  // const nextValueEvaluation = evaluate(nextValueExpression, environment, sigma);

  // if (nextValueEvaluation.get("waitCondition")) {
  //   return blockCurrentThread(
  //     state,
  //     semanticStatement,
  //     activeThreadIndex,
  //     nextValueEvaluation.get("waitCondition"),
  //   );
  // }

  // try {
  //   const unifiedSigma = unify(sigma, cellVariable, mutableVariable);

  //   const { sigma: finalSigma, variable: valueVariable } = convertToVariable(
  //     valueEvaluation,
  //     unifiedSigma,
  //     "cellValue",
  //   );

  //   return state
  //     .set("sigma", finalSigma)
  //     .update("mu", mu =>
  //       mu.add(buildMutableMapping(mutableVariable, valueVariable)),
  //     );
  // } catch (error) {
  //   return raiseSystemException(state, activeThreadIndex, failureException());
  // }
}
