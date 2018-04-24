import Immutable from "immutable";
import { unifyEvaluations, makeNewVariable } from "../machine/sigma";
import {
  buildSemanticStatement,
  buildEquivalenceClass,
  makeAuxiliaryIdentifier,
} from "../machine/build";
import {
  failureException,
  errorException,
  raiseSystemException,
} from "../machine/exceptions";
import { builtIns } from "../built_ins";
import { blockCurrentThread } from "../machine/threads";
import { evaluate } from "../expression";

const executeBuiltInValue = (
  procedureValue,
  state,
  semanticStatement,
  activeThreadIndex,
) => {
  const statement = semanticStatement.get("statement");
  const sigma = state.get("sigma");
  const environment = semanticStatement.get("environment");

  const builtInNamespace = procedureValue.get("namespace");
  const builtInOperator = procedureValue.get("operator");
  const builtIn = builtIns[builtInNamespace][builtInOperator];

  const args = statement.get("args");
  if (args.isEmpty()) {
    return raiseSystemException(state, activeThreadIndex, errorException());
  }

  const resultArg = args.last();
  const resultEvaluation = evaluate(resultArg, environment, sigma);

  if (resultEvaluation.get("waitCondition")) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      resultEvaluation.get("waitCondition"),
    );
  }

  const actualArgs = args.pop().map(x => evaluate(x, environment, sigma));

  if (!builtIn.validateArgs(actualArgs)) {
    return raiseSystemException(state, activeThreadIndex, errorException());
  }

  try {
    const builtInEvaluation = builtIn.evaluate(actualArgs, sigma);
    if (builtInEvaluation.get("waitCondition")) {
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        builtInEvaluation.get("waitCondition"),
      );
    }
    return state.update("sigma", sigma =>
      unifyEvaluations(sigma, resultEvaluation, builtInEvaluation),
    );
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, failureException());
  }
};

const executeProcedureValue = (
  procedureValue,
  state,
  semanticStatement,
  activeThreadIndex,
) => {
  const statement = semanticStatement.get("statement");
  const sigma = state.get("sigma");
  const environment = semanticStatement.get("environment");

  const callArguments = statement
    .get("args")
    .map(x => evaluate(x, environment, sigma));

  const declaredArguments = procedureValue
    .getIn(["value", "args"])
    .map(x => x.get("identifier"));

  if (declaredArguments.count() !== callArguments.count())
    return raiseSystemException(state, activeThreadIndex, errorException());

  const blockingArgument = callArguments.find(x => x.get("waitCondition"));
  if (blockingArgument) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      blockingArgument.get("waitCondition"),
    );
  }

  const { augmentedSigma, callArgumentVariables } = callArguments.reduce(
    ({ augmentedSigma, callArgumentVariables }, evaluation) => {
      if (evaluation.get("variable")) {
        return {
          augmentedSigma,
          callArgumentVariables: callArgumentVariables.push(
            evaluation.get("variable"),
          ),
        };
      }

      const auxIdentifier = makeAuxiliaryIdentifier("ARG");
      const auxVariable = makeNewVariable({
        in: augmentedSigma,
        for: auxIdentifier.get("identifier"),
      });
      const auxEquivalenceClass = buildEquivalenceClass(
        evaluation.get("value"),
        auxVariable,
      );

      return {
        augmentedSigma: augmentedSigma.add(auxEquivalenceClass),
        callArgumentVariables: callArgumentVariables.push(auxVariable),
      };
    },
    { augmentedSigma: sigma, callArgumentVariables: Immutable.List() },
  );

  const contextualEnvironment = procedureValue.getIn(["value", "context"]);
  const newEnvironment = callArgumentVariables
    .zip(declaredArguments)
    .reduce((accumulator, pair) => {
      return accumulator.set(pair[1], pair[0]);
    }, contextualEnvironment);

  const procedureBody = procedureValue.getIn(["value", "body"]);

  const newStatement = buildSemanticStatement(procedureBody, newEnvironment);

  return state
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(newStatement),
    )
    .set("sigma", augmentedSigma);
};

export default function(state, semanticStatement, activeThreadIndex) {
  const statement = semanticStatement.get("statement");
  const procedure = statement.get("procedure");

  const sigma = state.get("sigma");
  const environment = semanticStatement.get("environment");
  const evaluation = evaluate(procedure, environment, sigma);

  if (evaluation.get("value") === undefined) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      evaluation.get("variable") || evaluation.get("waitCondition"),
    );
  }

  const procedureValue = evaluation.get("value");

  if (procedureValue.get("type") === "builtIn") {
    return executeBuiltInValue(
      procedureValue,
      state,
      semanticStatement,
      activeThreadIndex,
    );
  }

  if (procedureValue.get("type") === "procedure") {
    return executeProcedureValue(
      procedureValue,
      state,
      semanticStatement,
      activeThreadIndex,
    );
  }

  return raiseSystemException(state, activeThreadIndex, errorException());
}
