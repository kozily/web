import Immutable from "immutable";
import {
  threadStatus,
  buildThread,
  buildSemanticStatement,
  buildEnvironment,
} from "./build";
import { lookupVariableInSigma } from "./sigma";
import { procedureApplicationStatement } from "./statements";
import { lexicalIdentifier } from "./lexical";

export const blockCurrentThread = (
  state,
  semanticStatement,
  activeThreadIndex,
  waitCondition,
) => {
  return state
    .updateIn(["threads", activeThreadIndex, "metadata"], metadata =>
      metadata
        .set("status", threadStatus.blocked)
        .set("waitCondition", waitCondition),
    )
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(semanticStatement),
    );
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

export const activateTrigger = (state, trigger) => {
  const procedureIdentifier = trigger.get("procedureIdentifier");
  const neededVariableIdentifier = trigger.get("neededVariableIdentifier");
  const statement = procedureApplicationStatement(
    lexicalIdentifier(procedureIdentifier),
    [lexicalIdentifier(neededVariableIdentifier)],
  );
  const environment = buildEnvironment({
    [procedureIdentifier]: trigger.get("procedure"),
    [neededVariableIdentifier]: trigger.get("neededVariable"),
  });

  const newThread = buildThread({
    semanticStatements: [buildSemanticStatement(statement, environment)],
  });

  return state
    .update("tau", tau => tau.delete(trigger))
    .update("threads", threads => threads.push(newThread));
};

export const processTriggers = state => {
  return state.get("tau").reduce((newState, trigger) => {
    const triggerVariable = trigger.get("neededVariable");

    const triggerVariableEquivalenceClass = lookupVariableInSigma(
      newState.get("sigma"),
      triggerVariable,
    );
    if (triggerVariableEquivalenceClass.get("value")) {
      return activateTrigger(newState, trigger);
    }

    const isVariableInWaitCondition = newState.get("threads").some(thread => {
      const waitCondition = thread.getIn(["metadata", "waitCondition"]);
      return Immutable.is(waitCondition, triggerVariable);
    });
    if (isVariableInWaitCondition) {
      return activateTrigger(newState, trigger);
    }

    return newState;
  }, state);
};
