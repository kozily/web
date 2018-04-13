import Immutable from "immutable";
import { execute } from "./execution";
import { threadStatus } from "./machine/build";
import { processWaitConditions, processTriggers } from "./machine/threads";

export const isExecutableThread = thread => {
  return (
    thread.getIn(["metadata", "status"]) === threadStatus.ready &&
    !thread.get("stack").isEmpty()
  );
};

export const isFinalState = state => {
  return state.get("threads").every(thread => !isExecutableThread(thread));
};

export const executeSingleStep = state => {
  const activeThreadIndices = state
    .get("threads")
    .map((thread, index) => ({ thread, index }))
    .filter(entry => isExecutableThread(entry.thread))
    .map(entry => entry.index);
  const randomIndex = Math.floor(Math.random() * activeThreadIndices.size);
  const activeThreadIndex = activeThreadIndices.get(randomIndex);
  const activeThread = state.getIn(["threads", activeThreadIndex]);

  const semanticStatement = activeThread.get("stack").peek();

  const reducibleState = state
    .update("threads", threads =>
      threads.map((thread, index) =>
        thread.setIn(["metadata", "current"], index === activeThreadIndex),
      ),
    )
    .updateIn(["threads", activeThreadIndex, "stack"], stack => stack.pop());

  return processTriggers(
    processWaitConditions(
      execute(reducibleState, semanticStatement, activeThreadIndex),
    ),
  );
};

export const executeAllSteps = (state, result = new Immutable.List()) => {
  const updatedResult = result.push(state);

  if (isFinalState(state)) {
    return updatedResult;
  }

  return executeAllSteps(executeSingleStep(state), updatedResult);
};
