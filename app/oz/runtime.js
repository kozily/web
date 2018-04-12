import Immutable from "immutable";
import { execute } from "./execution";

export const isExecutableThread = thread => {
  return (
    thread.getIn(["metadata", "status"]) === "ready" &&
    !thread.get("stack").isEmpty()
  );
};

export const isFinalState = state => {
  return state.get("threads").every(thread => !isExecutableThread(thread));
};

export const executeSingleStep = state => {
  const activeThreadIndex = state.get("threads").findIndex(isExecutableThread);
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

  if (isFinalState(state)) {
    return updatedResult;
  }

  return executeAllSteps(executeSingleStep(state), updatedResult);
};
