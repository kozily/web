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
      const tree = parser(input);

      if (tree) {
        try {
          const kernel = kernelizer(tree);
          const runtime = oz.build.fromKernelAST(kernel);
          this.triggerSteps(kernel, oz.steps(runtime));
        } catch (error) {
          this.triggerSteps();
          console.error(error);
        }
      } else {
        this.triggerSteps();
      }
    });

    if (process.env.NODE_ENV !== 'production') {
      setTimeout(() => this.editor.refresh(), 1000);
    }
  }

  triggerSteps(kernel = {}, execution = []) {
    this.props.onSteps({
      kernel,
      execution,
    });
  }

  render() {
    return (
      <div ref={(ref) => { this.editorElement = ref; }} />
    );
  }
}

Editor.propTypes = {
  onSteps: React.PropTypes.func.isRequired,
};
