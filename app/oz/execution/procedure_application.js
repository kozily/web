import {
  lookupVariableInSigma,
  unifyVariableToEvaluation,
} from "../machine/sigma";
import { buildSemanticStatement } from "../machine/build";
import {
  failureException,
  errorException,
  raiseSystemException,
} from "../machine/exceptions";
import { builtIns } from "../machine/built_ins";
import { blockCurrentThread } from "../machine/threads";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const procedureIdentifier = statement.getIn(["procedure", "identifier"]);
  const procedureVariable = environment.get(procedureIdentifier);
  const procedureValue = lookupVariableInSigma(sigma, procedureVariable).get(
    "value",
  );

  if (procedureValue === undefined) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      procedureVariable,
    );
  }

  if (procedureValue.get("type") === "builtIn") {
    const builtInNamespace = procedureValue.get("namespace");
    const builtInOperator = procedureValue.get("operator");
    const builtIn = builtIns[builtInNamespace][builtInOperator];

    const argsIdentifiers = statement.get("args").map(x => x.get("identifier"));
    const argsVariables = argsIdentifiers.map(x => environment.get(x));
    if (argsVariables.isEmpty()) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }

    const resultVariable = argsVariables.last();
    const actualArgsVariables = argsVariables.pop();
    const argsValues = actualArgsVariables.map(x =>
      lookupVariableInSigma(sigma, x).get("value"),
    );

    if (argsValues.some(x => x === undefined)) {
      const unboundArgIndex = argsValues.findIndex(x => x === undefined);
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        actualArgsVariables.get(unboundArgIndex),
      );
    }

    if (!builtIn.validateArgs(argsValues)) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }

    const evaluationResult = builtIn.evaluate(argsValues, sigma);
    try {
      return state.update("sigma", sigma =>
        unifyVariableToEvaluation(sigma, resultVariable, evaluationResult),
      );
    } catch (error) {
      return raiseSystemException(state, activeThreadIndex, failureException());
    }
  }

  if (procedureValue.get("type") === "procedure") {
    const callArguments = statement.get("args").map(x => x.get("identifier"));

    const declaredArguments = procedureValue
      .getIn(["value", "args"])
      .map(x => x.get("identifier"));

    if (declaredArguments.count() !== callArguments.count())
      return raiseSystemException(state, activeThreadIndex, errorException());

    const contextualEnvironment = procedureValue.getIn(["value", "context"]);
    const newEnvironment = callArguments
      .zip(declaredArguments)
      .reduce((accumulator, pair) => {
        return accumulator.set(pair[1], environment.get(pair[0]));
      }, contextualEnvironment);

    const procedureBody = procedureValue.getIn(["value", "body"]);

    const newStatement = buildSemanticStatement(procedureBody, newEnvironment);

    return state.updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(newStatement),
    );
  }

  return raiseSystemException(state, activeThreadIndex, errorException());
}
