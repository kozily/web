import React from 'react';
import { default as Icon, IconStack } from './icons';
import './navbar.sass';

export default function () {
  return (
    <nav className="navbar navbar-inverse">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand">
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
