import React from "react";
import { Menu, Header, Icon } from "semantic-ui-react";

export const NavBar = () => {
  return (
    <Menu borderless>
      <Menu.Item>
        <Icon name="home" size="big" />
      </Menu.Item>
      <Menu.Item>
        <Header as="h2">
          <Header.Content>
            Kozily
            <Header.Subheader>Oz compiler</Header.Subheader>
          </Header.Content>
        </Header>
      </Menu.Item>
    </Menu>
  );
};

export default NavBar;
