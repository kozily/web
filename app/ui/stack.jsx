import React from "react";
import { Container, Menu, Header } from "semantic-ui-react";

export const Stack = props => {
  return (
    <Container fluid>
      <Header as="h5" textAlign="center">
        {props.container.metadata.name}
      </Header>
      <Menu
        color={props.color}
        fluid
        vertical
        key={props.container.metadata.name}
      >
        {props.container.stack.map((elementInStack, indx) => (
          <Menu.Item key={indx} active={indx == 0}>
            {elementInStack}
          </Menu.Item>
        ))}
      </Menu>
    </Container>
  );
};

export default Stack;
