import React from 'react';
import Icon from './icons';
import Editor from './editor';

export default function () {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <Icon icon="list-ol" /> Code
            </div>
            <div className="panel-body">
              <Editor />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

