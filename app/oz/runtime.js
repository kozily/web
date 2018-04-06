import Immutable from "immutable";
import { execute } from "./execution";

export const isFinalState = state => {
  return (
    state.get("threads").isEmpty() ||
    state.get("threads").every(thread => thread.get("stack").isEmpty())
  );
};

export const isBlockedState = state => {
  return state
    .get("threads")
    .every(thread => thread.getIn(["metadata", "status"]) === "blocked");
};

export const executeSingleStep = state => {
  const activeThreadIndex = state
    .get("threads")
    .findIndex(thread => thread.getIn(["metadata", "status"]) === "current");
  const activeThread = state.getIn(["threads", activeThreadIndex]);

  const activeStack = activeThread.get("stack");

  const semanticStatement = activeStack.peek();

  const reducibleState = state.updateIn(
    ["threads", activeThreadIndex, "stack"],
    stack => stack.pop(),
  );

  return execute(reducibleState, semanticStatement, activeThreadIndex);
};

export const executeAllSteps = (state, result = new Immutable.List()) => {
  const updatedResult = result.push(state);

  if (isFinalState(state) || isBlockedState(state)) {
    return updatedResult;
  }

  return executeAllSteps(executeSingleStep(state), updatedResult);
};
