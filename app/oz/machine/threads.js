export const blockCurrentThread = (
  state,
  semanticStatement,
  activeThreadIndex,
) => {
  return state
    .setIn(["threads", activeThreadIndex, "metadata", "status"], "blocked")
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(semanticStatement),
    );
};
