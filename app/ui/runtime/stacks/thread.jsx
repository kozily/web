import React from "react";
import { isExecutableThread } from "../../../oz/runtime";
import { Menu } from "semantic-ui-react";
import SemanticStatement from "./semantic_statement";
import WaitCondition from "./wait_condition";
import { connect } from "react-redux";
import { next } from "../../../state/runtime";

const threadColor = thread => {
  if (thread.getIn(["metadata", "waitCondition"])) {
    return "red";
  }

  if (thread.get("stack").isEmpty()) {
    return "green";
  }

  return "blue";
};

export const RuntimeStacksThread = props => {
  const thread = props.thread;
  const name = thread.get("name");
  const index = thread.get("index");
  const stack = thread.get("stack").toSeq();
  const waitCondition = thread.getIn(["metadata", "waitCondition"]);
  const color = threadColor(thread);
  const hasNext = isExecutableThread(thread);

  return (
    <div>
      <Menu inverted borderless attached="top" color={color} size="small">
        <Menu.Item header icon="tasks" content={name} />
        {hasNext ? (
          <Menu.Item
            icon="play"
            position="right"
            onClick={() => props.onNext(index)}
          />
        ) : null}
      </Menu>
      {waitCondition ? (
        <Menu inverted borderless attached color={color} size="small">
          <Menu.Item>
            <WaitCondition waitCondition={waitCondition} />
          </Menu.Item>
        </Menu>
      ) : null}
      {stack.isEmpty() ? (
        <Menu inverted borderless attached color={color} size="small">
          <Menu.Item content="Stack is empty" />
        </Menu>
      ) : null}
      {stack.map((semanticStatement, index) => (
        <SemanticStatement key={index} semanticStatement={semanticStatement} />
      ))}
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  onNext: index => dispatch(next(index)),
});

export default connect(undefined, mapDispatchToProps)(RuntimeStacksThread);
