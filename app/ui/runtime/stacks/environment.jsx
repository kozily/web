import React from "react";
import { List, Icon } from "semantic-ui-react";
import Variable from "../variable";

export const RuntimeStacksEnvironment = ({ environment }) => {
  if (environment.isEmpty()) {
    return <div />;
  }

  return (
    <List>
      {environment.entrySeq().map(([key, variable]) => (
        <List.Item key={key}>
          <span>
            {key}
            <Icon name="arrow right" />
            <Variable variable={variable} />
          </span>
        </List.Item>
      ))}
    </List>
  );
};

export default RuntimeStacksEnvironment;
