import React from 'react';
import { default as Icon, IconStack } from './icons';
import './navbar.sass';

export const NavBar = () => {
  return (
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">
            <IconStack>
              <Icon icon="home" stack="1x" />
              <Icon icon="square-o" stack="2x" />
            </IconStack>
            <small>Kozily</small>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
