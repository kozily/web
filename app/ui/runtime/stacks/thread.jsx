import React from "react";
import { isExecutableThread } from "../../../oz/runtime";
import { Menu, Header } from "semantic-ui-react";
import SemanticStatement from "./semantic_statement";
import WaitCondition from "./wait_condition";
import { connect } from "react-redux";
import { next } from "../../../state/runtime";

const threadColor = thread => {
  if (thread.getIn(["metadata", "waitCondition"])) {
    return "red";
  }

  if (thread.get("stack").isEmpty()) {
    return "olive";
  }

  return "blue";
};

export const RuntimeStacksThread = props => {
  const thread = props.thread;
  const name = thread.get("name");
  const index = thread.get("index");
  const stack = thread.get("stack").toSeq();
  const waitCondition = thread.getIn(["metadata", "waitCondition"]);
  const isCurrent = thread.getIn(["metadata", "current"]);

  return (
    <Menu
      inverted={isCurrent}
      color={threadColor(thread)}
      vertical
      attached
      fluid
      size="tiny"
      onClick={() => (props.hasNextStep(index) ? props.onNext(index) : false)}
    >
      <Menu.Item active>
        <Menu.Header>{name}</Menu.Header>
        {waitCondition ? (
          <Header.Subheader>
            <WaitCondition waitCondition={waitCondition} />
          </Header.Subheader>
        ) : null}
        {stack.isEmpty() ? <Header.Subheader content="Stack is empty" /> : null}
      </Menu.Item>
      {stack.map((semanticStatement, index) => (
        <SemanticStatement key={index} semanticStatement={semanticStatement} />
      ))}
    </Menu>
  );
};

const mapStateToProps = state => {
  const currentStep = state.getIn(["runtime", "currentStep"]);
  const threads = state.getIn(["runtime", "steps", currentStep, "threads"]);
  return {
    hasNextStep: index =>
      threads.get(index) !== undefined &&
      isExecutableThread(threads.get(index)),
    hasPreviousStep: currentStep > 0,
  };
};

const mapDispatchToProps = dispatch => ({
  onNext: index => dispatch(next(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  RuntimeStacksThread,
);
