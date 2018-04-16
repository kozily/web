import {
  makeNewVariable,
  lookupVariableInSigma,
  unify,
} from "../machine/sigma";
import {
  buildSemanticStatement,
  makeAuxiliaryIdentifier,
  buildEquivalenceClass,
} from "../machine/build";
import { errorException, raiseSystemException } from "../machine/exceptions";
import { blockCurrentThread } from "../machine/threads";
import { builtIns } from "../machine/builtIns";

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

    const userRecordDefinedVariables = callArguments.map(x =>
      environment.get(x),
    );
    const bindingVariable = userRecordDefinedVariables.last();
    const argumentVariables = userRecordDefinedVariables.pop();

    const userRecordDefinedValues = argumentVariables.map(x =>
      lookupVariableInSigma(sigma, x).get("value"),
    );
    if (userRecordDefinedValues.get(0) === undefined) {
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        argumentVariables.first(),
      );
    }
    if (userRecordDefinedValues.get(1) === undefined) {
      return blockCurrentThread(
        state,
        semanticStatement,
        activeThreadIndex,
        argumentVariables.last(),
      );
    }

    const featureSelected = statement.getIn([
      "procedure",
      "feature",
      "value",
      "label",
    ]);
    if (callIdentifier !== "Record" || featureSelected !== ".") {
      // must be a builtin
      const builtIn = builtIns[callIdentifier][featureSelected];
      if (builtIn === undefined) {
        return raiseSystemException(state, activeThreadIndex, errorException());
      }
      try {
        const value = builtIn.handler(userRecordDefinedValues);
        const aux = makeAuxiliaryIdentifier();
        const newVariable = makeNewVariable({
          in: state.get("sigma"),
          for: aux.get("identifier"),
        });
        const newEquivalenceClass = buildEquivalenceClass(value, newVariable);
        const newSigma = sigma.add(newEquivalenceClass);

        const unifiedSigma = unify(newSigma, bindingVariable, newVariable);
        const resultingEquivalenceClass = lookupVariableInSigma(
          unifiedSigma,
          newVariable,
        );
        const cleanUnifiedSigma = unifiedSigma
          .delete(resultingEquivalenceClass)
          .add(
            resultingEquivalenceClass.update("variables", variables =>
              variables.delete(newVariable),
            ),
          );

        return state.set("sigma", cleanUnifiedSigma);
      } catch (error) {
        return raiseSystemException(state, activeThreadIndex, errorException());
      }
    }

    if (userRecordDefinedValues.some(x => !isRecord(x))) {
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

    const userRecordDefinedVariables = callArguments.map(x =>
      environment.get(x),
    );
    const bindingVariable = userRecordDefinedVariables.last();
    const userRecordDefinedValues = userRecordDefinedVariables
      .pop()
      .map(x => lookupVariableInSigma(sigma, x).get("value"));
    if (userRecordDefinedValues.some(x => x === undefined)) {
      return blockCurrentThread(state, semanticStatement, activeThreadIndex);
    }
    const builtIn =
      builtIns[procedureValue.get("namespace")][procedureValue.get("operator")];
    const value = builtIn.handler(
      userRecordDefinedValues,
      state,
      activeThreadIndex,
    );
    const aux = makeAuxiliaryIdentifier();
    const newVariable = makeNewVariable({
      in: state.get("sigma"),
      for: aux.get("identifier"),
    });
    const newEquivalenceClass = buildEquivalenceClass(value, newVariable);
    const newSigma = sigma.add(newEquivalenceClass);

    try {
      const unifiedSigma = unify(newSigma, bindingVariable, newVariable);
      const resultingEquivalenceClass = lookupVariableInSigma(
        unifiedSigma,
        newVariable,
      );
      const cleanUnifiedSigma = unifiedSigma
        .delete(resultingEquivalenceClass)
        .add(
          resultingEquivalenceClass.update("variables", variables =>
            variables.delete(newVariable),
          ),
        );

      return state.set("sigma", cleanUnifiedSigma);
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
