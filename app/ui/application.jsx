import React from 'react';
import NavBar from './navbar';
import Ide from './ide';
import './application.sass';

export const Application = () => {
  return (
    <div>
      <NavBar />
      <Ide />
    </div>
  );
};

export default Application;

