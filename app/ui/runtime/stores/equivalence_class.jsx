import React from "react";
import { List } from "semantic-ui-react";
import Variable from "../variable";

export const RuntimeStoresEquivalenceClass = props => {
  const allVariables = props.equivalenceClass.get("variables");
  const variables = props.showSystemVariables
    ? allVariables
    : allVariables.filter(v => !v.get("system"));

  return (
    <List horizontal>
      {variables.map((variable, index) => (
        <List.Item key={index}>
          <Variable variable={variable} />
        </List.Item>
      ))}
    </List>
  );
};

export default RuntimeStoresEquivalenceClass;
