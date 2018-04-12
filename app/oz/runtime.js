import Immutable from "immutable";
import { execute } from "./execution";
import { threadStatus } from "./machine/build";
import { lookupVariableInSigma } from "./machine/sigma";

export const isExecutableThread = thread => {
  return (
    thread.getIn(["metadata", "status"]) === threadStatus.ready &&
    !thread.get("stack").isEmpty()
  );
};

export const isFinalState = state => {
  return state.get("threads").every(thread => !isExecutableThread(thread));
};

export const processWaitConditions = state => {
  return state.update("threads", threads =>
    threads.map(thread => {
      const waitCondition = thread.getIn(["metadata", "waitCondition"]);
      if (!waitCondition) {
        return thread;
      }

      const waitConditionEquivalenceClass = lookupVariableInSigma(
        state.get("sigma"),
        waitCondition,
      );
      if (!waitConditionEquivalenceClass.get("value")) {
        return thread;
      }

      return thread.update("metadata", metadata =>
        metadata.set("status", threadStatus.ready).set("waitCondition", null),
      );
    }),
  );
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

  const reducibleState = state.updateIn(
    ["threads", activeThreadIndex, "stack"],
    stack => stack.pop(),
  );

  const result = execute(reducibleState, semanticStatement, activeThreadIndex);
  return processWaitConditions(result);
};

export const executeAllSteps = (state, result = new Immutable.List()) => {
  const updatedResult = result.push(state);

  if (isFinalState(state)) {
    return updatedResult;
  }

  return executeAllSteps(executeSingleStep(state), updatedResult);
};
