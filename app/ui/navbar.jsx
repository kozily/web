import React from "react";
import { Menu } from "semantic-ui-react";

export const NavBar = () => {
  return (
    <Menu attached borderless fluid size="small">
      <Menu.Item header icon="home" content="Kozily" />
    </Menu>
  );
};

export default NavBar;
