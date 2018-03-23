import React from "react";
import { Menu, Icon, Container, Divider } from "semantic-ui-react";
import MST from "./multiple-stacks";
import Stores from "./stores";

export const Debuger = () => {
  return (
    <Container>
      <Menu borderless>
        <Menu.Item>
          <Icon name="bug" />
        </Menu.Item>
        <Menu.Item>Debug Panel</Menu.Item>
      </Menu>
      <MST />
      <Divider horizontal />
      <Stores />
    </Container>
  );
};

export default Debuger;
