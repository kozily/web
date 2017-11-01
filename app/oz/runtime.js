import Immutable from "immutable";
import reducers from "./reducers/index";

function validate(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateSemanticStatement(semanticStatement) {
  validate(
    semanticStatement.getIn(["statement", "node"]) === "statement",
    "Semantic statement has non-executable node",
  );
  validate(
    semanticStatement.getIn(["statement", "type"]) !== undefined,
    "Semantic statement has undefined type",
  );
  return semanticStatement;
}

function validateReducer(reducer) {
  validate(reducer !== undefined, "Semantic statement has unrecognized type");
  return reducer;
}

export const isFinalState = state => {
  return state.get("stack").isEmpty();
};

export const executeSingleStep = state => {
  try {
    const semanticStatement = validateSemanticStatement(
      state.get("stack").peek(),
    );
    const reducer = validateReducer(
      reducers[semanticStatement.getIn(["statement", "type"])],
    );
    const reducibleState = state.update("stack", stack => stack.pop());

    return reducer(reducibleState, semanticStatement);
  } catch (error) {
    throw new Error(`${error.message}: ${state.toString()}`);
  }
};

export const executeAllSteps = (state, result = new Immutable.List()) => {
  const updatedResult = result.push(state);

  if (isFinalState(state)) {
    return updatedResult;
  }

  return executeAllSteps(executeSingleStep(state), updatedResult);
};
