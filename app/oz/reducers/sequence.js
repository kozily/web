import Immutable from "immutable";

export default function(state, semanticStatement) {
  return state.update("stack", stack =>
    stack.push(
      new Immutable.Map({
        statement: semanticStatement.getIn(["statement", "head"]),
        environment: semanticStatement.get("environment"),
      }),
      new Immutable.Map({
        statement: semanticStatement.getIn(["statement", "tail"]),
        environment: semanticStatement.get("environment"),
      }),
    ),
  );
}
