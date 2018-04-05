import React from "react";
import { Container, Menu, Header } from "semantic-ui-react";

export const Stack = props => {
  return (
    <Container fluid>
      <Header as="h5" textAlign="center">
        {props.name}
      </Header>
      <Menu color={props.color} fluid vertical key={props.name}>
        {props.container
          .reduce((acc, item) => acc.concat(item), [])
          .map((ss, indx) => (
            <Menu.Item key={indx} active={props.indx == 0}>
              {ss.statement.type}
            </Menu.Item>
          ))}
      </Menu>
    </Container>
  );
};

export default Stack;
