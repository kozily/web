import React from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/oz/oz';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/selection/active-line';

export default class Editor extends React.Component {
  componentDidMount() {
    const options = {
      value: 'local X = 1 in\n  {Browse X}\n end',
      mode: 'oz',
      theme: 'base16-light',
      tabSize: 2,
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      styleActiveLine: true,
    };

    this.editor = new CodeMirror(this.editorElement, options);

    if (process.env.NODE_ENV !== 'production') {
      setTimeout(() => this.editor.refresh(), 1000);
    }
  }

  render() {
    return (
      <div ref={(ref) => { this.editorElement = ref; }} />
    );
  }
}

