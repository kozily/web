import React from "react";
import { Menu, Header } from "semantic-ui-react";
import SemanticStatement from "./semantic_statement";
import WaitCondition from "./wait_condition";

const threadColor = thread => {
  if (thread.getIn(["metadata", "waitCondition"])) {
    return "red";
  }

  if (thread.get("stack").isEmpty()) {
    return "olive";
  }

  return "blue";
};

export const RuntimeStacksThread = ({ thread }) => {
  const name = thread.get("name");
  const stack = thread.get("stack").toSeq();
  const waitCondition = thread.getIn(["metadata", "waitCondition"]);

  return (
    <Menu vertical attached fluid size="tiny">
      <Menu.Item header>
        <Header color={threadColor(thread)}>{name}</Header>
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

export default RuntimeStacksThread;
