import React from "react";
import { Menu } from "semantic-ui-react";
import SemanticStatement from "./semantic_statement";

export const RuntimeStacksThread = props => {
  const name = props.thread.get("name");
  const stack = props.thread.get("stack").toSeq();

  return (
    <Menu vertical attached fluid size="tiny">
      <Menu.Item header content={name} />
      {stack.map((semanticStatement, index) => (
        <SemanticStatement
          key={index}
          active={index === 0}
          semanticStatement={semanticStatement}
        />
      ))}
    </Menu>
  );
};

export default RuntimeStacksThread;
