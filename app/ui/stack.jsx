import React from "react";
import { Popup, Container, Menu, Header } from "semantic-ui-react";
import JSONTree from "react-json-tree";

export const Stack = props => {
  return (
    <Container fluid>
      <Header as="h5" textAlign="center">
        {props.name}
      </Header>
      {props.container
        .reduce((acc, item) => acc.concat(item), [])
        .map((ss, indx) => (
          <Menu color={props.color} fluid vertical key={props.name}>
            <Popup
              key={indx}
              trigger={
                <Menu.Item active={props.indx == 0}>
                  {ss.statement.type}
                </Menu.Item>
              }
              flowing
              hoverable
            >
              <JSONTree
                data={props.container
                  .reduce((acc, item) => acc.concat(item), [])
                  .map(ss => ss.statement)}
              />
            </Popup>
          </Menu>
        ))}
    </Container>
  );
};

export default Stack;
