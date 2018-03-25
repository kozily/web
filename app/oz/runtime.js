import Immutable from "immutable";
import { execute } from "./execution";

export const isFinalState = state => {
  return state.get("stack").isEmpty();
};

export const executeSingleStep = state => {
  try {
    const semanticStatement = state.get("stack").peek();
    const reducibleState = state.update("stack", stack => stack.pop());

    return execute(reducibleState, semanticStatement);
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
