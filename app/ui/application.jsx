import React from 'react';
import NavBar from './navbar';
import Ide from './ide';
import './application.sass';

export default function () {
  return (
    <div>
      <NavBar />
      <Ide />
    </div>
  );
}

