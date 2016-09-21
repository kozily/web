import React from 'react';
import NavBar from './navbar';
import Editor from './editor';
import './application.sass';

export default function () {
  return (
    <div>
      <NavBar />
      <Editor />
    </div>
  );
}

