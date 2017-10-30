import React from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/oz/oz";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-light.css";
import "codemirror/addon/selection/active-line";
import parser from "../oz/parser";
import kernelizer from "../oz/kernelizer";
import oz from "../oz/machine";

export default class Editor extends React.Component {
  componentDidMount() {
    const options = {
      mode: "oz",
      theme: "base16-light",
      tabSize: 2,
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      styleActiveLine: true,
    };

    this.editor = new CodeMirror(this.editorElement, options);

    this.editor.on("change", () => {
      const input = this.editor.getValue();

      try {
        const tree = parser(input);

        if (tree) {
          const kernel = kernelizer(tree);
          this.triggerSteps(kernel);
          try {
            const runtime = oz.build.fromKernelAST(kernel);
            const steps = oz.steps(runtime);
            this.triggerSteps(kernel, steps);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            this.triggerSteps(kernel);
          }
        } else {
          this.triggerSteps();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.triggerSteps();
      }
    });

    setTimeout(() => this.editor.refresh(), 1000);
  }

  triggerSteps(kernel = {}, execution = []) {
    this.props.onSteps({
      kernel,
      execution,
    });
  }

  render() {
    return (
      <div
        ref={ref => {
          this.editorElement = ref;
        }}
      />
    );
  }
}
