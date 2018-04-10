import { lookupVariableInSigma, unify } from "../machine/sigma";
import { buildSemanticStatement } from "../machine/build";
import { errorException, raiseSystemException } from "../machine/exceptions";

const isRecord = statement => {
  return statement.get("type") === "record";
};

const isAtom = (...args) => {
  const [record] = args;
  return (
    record.getIn(["value", "label"]) != undefined &&
    record.getIn(["value", "features"]).isEmpty()
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
      !isRecord(statement.getIn(["procedure", "feature"])) ||
      !isAtom(statement.getIn(["procedure", "feature"])) ||
      statement.getIn(["procedure", "feature", "value", "label"]) !== "."
    ) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }
    if (callArguments.size !== 3) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }
    const userRecordDefinedVariables = callArguments.map(x =>
      environment.get(x),
    );
    const bindingVariable = userRecordDefinedVariables.last();
    const userRecordDefinedValues = userRecordDefinedVariables
      .pop()
      .map(x => lookupVariableInSigma(sigma, x).get("value"));
    if (
      userRecordDefinedValues.map(x => x === undefined).some(e => e === true)
    ) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }
    if (userRecordDefinedValues.map(x => isRecord(x)).some(e => e === false)) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }
    const arg1 = userRecordDefinedValues.get(0);
    const arg2 = userRecordDefinedValues.get(1);
    if (!isAtom(arg2)) {
      return raiseSystemException(state, activeThreadIndex, errorException());
    }
    const variable2Point = arg1
      .getIn(["value", "features"])
      .get(arg2.getIn(["value", "label"]));
    return state.update("sigma", sigma =>
      unify(sigma, bindingVariable, variable2Point),
    );
  }

  const variable = environment.get(callIdentifier);
  const equivalenceClass = lookupVariableInSigma(sigma, variable);

  const procedureValue = equivalenceClass.get("value");

  if (procedureValue === undefined) {
    return state
      .setIn(["threads", activeThreadIndex, "metadata", "status"], "blocked")
      .updateIn(["threads", activeThreadIndex, "stack"], stack =>
        stack.push(semanticStatement),
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
