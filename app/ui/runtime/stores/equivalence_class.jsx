import React from "react";
import { List } from "semantic-ui-react";
import Variable from "../variable";

export const RuntimeStoresEquivalenceClass = ({ equivalenceClass }) => {
  return (
    <List horizontal>
      {equivalenceClass.get("variables").map((variable, index) => (
        <List.Item key={index}>
          <Variable variable={variable} />
        </List.Item>
      ))}
    </List>
  );
};

export default RuntimeStoresEquivalenceClass;
