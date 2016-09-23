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

import parser from '../oz/parser';
import kernelizer from '../oz/kernelizer';
import oz from '../oz/machine';

export default class Editor extends React.Component {
  componentDidMount() {
    const options = {
      mode: 'oz',
      theme: 'base16-light',
      tabSize: 2,
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      styleActiveLine: true,
    };

    this.editor = new CodeMirror(this.editorElement, options);

    this.editor.on('change', () => {
      const input = this.editor.getValue();
      console.group(`Editor value ${input}`);
      try {
        const tree = parser(input);
        console.log('Parse tree', tree ? tree.toJS() : null);

        if (tree) {
          const kernel = kernelizer(tree);
          console.log('Kernel', kernel.toJS());
          let state = oz.build(kernel);
          do {
            console.log('Stepping through state', state.toJS());
            state = oz.step(state);
          } while (!oz.isFinal(state));

          console.log('Final state', state.toJS());
        }
      } catch (error) {
        console.error(error);
      } finally {
        console.groupEnd();
      }
    });

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

