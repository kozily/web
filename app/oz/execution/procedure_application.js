import { lookupVariableInSigma, unify } from "../machine/sigma";
import { buildSemanticStatement } from "../machine/build";
import { errorException, raiseSystemException } from "../machine/exceptions";
import { blockCurrentThread } from "../machine/threads";

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
    if (
      callIdentifier !== "Record" ||
      !isAtom(statement.getIn(["procedure", "feature"])) ||
      statement.getIn(["procedure", "feature", "value", "label"]) !== "."
    ) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }

    if (callArguments.size !== 3) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }

    const argumentVariables = callArguments.map(x => environment.get(x));
    const firstArgumentVariable = argumentVariables.get(0);
    const firstArgumentEquivalenceClass = lookupVariableInSigma(
      sigma,
      firstArgumentVariable,
    );
    const firstArgumentValue = firstArgumentEquivalenceClass.get("value");
    const secondArgumentVariable = argumentVariables.get(1);
    const secondArgumentEquivalenceClass = lookupVariableInSigma(
      sigma,
      secondArgumentVariable,
    );
    const secondArgumentValue = secondArgumentEquivalenceClass.get("value");
    const bindingVariable = argumentVariables.get(2);

    if (firstArgumentValue === undefined) {
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        firstArgumentVariable,
      );
    }

    if (!isRecord(firstArgumentValue)) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }

    if (secondArgumentValue === undefined) {
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        secondArgumentVariable,
      );
    }

    if (!isAtom(secondArgumentValue)) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }

    const featureVariable = firstArgumentValue.getIn([
      "value",
      "features",
      secondArgumentValue.getIn(["value", "label"]),
    ]);

    return state.update("sigma", sigma =>
      unify(sigma, bindingVariable, featureVariable),
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

  if (procedureValue.get("type") !== "procedure")
    return raiseSystemException(state, activeThreadIndex, errorException());

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
