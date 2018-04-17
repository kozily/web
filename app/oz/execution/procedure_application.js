import { lookupVariableInSigma, unify } from "../machine/sigma";
import { buildSemanticStatement } from "../machine/build";
import { errorException, raiseSystemException } from "../machine/exceptions";
import { blockCurrentThread } from "../machine/threads";
import { newSigmaAfterBuiltIn } from "./builtin";

const isRecord = node => {
  return node.get("type") === "record";
};

const isAtom = node => {
  return (
    isRecord(node) &&
    node.getIn(["value", "label"]) != undefined &&
    node.getIn(["value", "features"]).isEmpty()
  );
};

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const nodeCallIdentifier = statement.getIn(["procedure", "node"]);
  const callIdentifier = statement.getIn(["procedure", "identifier"]);
  const callArguments = statement.get("args").map(x => x.get("identifier"));

  if (nodeCallIdentifier === "recordSelection") {
    if (!isAtom(statement.getIn(["procedure", "feature"]))) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }

    if (callArguments.size !== 3) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }

    const procedureVariables = callArguments.map(x => environment.get(x));
    const resultVariable = procedureVariables.last();
    const argumentVariables = procedureVariables.pop();

    const argumentValues = argumentVariables.map(x =>
      lookupVariableInSigma(sigma, x).get("value"),
    );
    if (argumentValues.get(0) === undefined) {
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        argumentVariables.first(),
      );
    }
    if (argumentValues.get(1) === undefined) {
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        argumentVariables.last(),
      );
    }

    const operator = statement.getIn([
      "procedure",
      "feature",
      "value",
      "label",
    ]);
    if (callIdentifier !== "Record" || operator !== ".") {
      // must be a builtin
      try {
        return state.set(
          "sigma",
          newSigmaAfterBuiltIn(
            sigma,
            callIdentifier,
            operator,
            argumentValues,
            resultVariable,
          ),
        );
      } catch (error) {
        return raiseSystemException(state, activeThreadIndex, errorException());
      }
    }

    if (argumentValues.some(x => !isRecord(x))) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }
    const arg1 = argumentValues.get(0);
    const arg2 = argumentValues.get(1);
    if (!isAtom(arg2)) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }
    const variable2Point = arg1
      .getIn(["value", "features"])
      .get(arg2.getIn(["value", "label"]));
    return state.update("sigma", sigma =>
      unify(sigma, resultVariable, variable2Point),
    );
  }

  const variable = environment.get(callIdentifier);
  const equivalenceClass = lookupVariableInSigma(sigma, variable);

  const procedureValue = equivalenceClass.get("value");

  if (procedureValue === undefined) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      variable,
    );
  }

  if (
    procedureValue.get("type") !== "procedure" &&
    procedureValue.get("type") !== "builtIn"
  )
    return raiseSystemException(state, activeThreadIndex, errorException());

  if (procedureValue.get("type") === "builtIn") {
    if (callArguments.size !== 3) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }

    const procedureVariables = callArguments.map(x => environment.get(x));
    const resultVariable = procedureVariables.last();
    const argumentVariables = procedureVariables.pop();

    const argumentValues = argumentVariables.map(x =>
      lookupVariableInSigma(sigma, x).get("value"),
    );
    if (argumentValues.get(0) === undefined) {
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        argumentVariables.first(),
      );
    }
    if (argumentValues.get(1) === undefined) {
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        argumentVariables.last(),
      );
    }

    try {
      return state.set(
        "sigma",
        newSigmaAfterBuiltIn(
          sigma,
          procedureValue.get("namespace"),
          procedureValue.get("operator"),
          argumentValues,
          resultVariable,
        ),
      );
    } catch (error) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }
  }
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
