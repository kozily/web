import { threadStatus } from "../machine/build";

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
