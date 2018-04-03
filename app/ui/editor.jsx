import React from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/oz/oz";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-light.css";
import "codemirror/addon/selection/active-line";
// import parser from "../oz/parser";
// import kernelizer from "../oz/kernelizer";
// import { buildFromKernelAST } from "../oz/machine/build";
// import { executeAllSteps } from "../oz/runtime";
import { connect } from "react-redux";
import { changeSourceCode } from "../state/parse";

export class Editor extends React.Component {
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
      this.props.changeSourceCode(input);
      // try {
      //   const tree = parser(input);

      //   if (tree) {
      //     const kernel = kernelizer(tree);
      //     this.triggerSteps(kernel);
      //     try {
      //       const runtime = buildFromKernelAST(kernel);
      //       const steps = executeAllSteps(runtime);
      //       this.triggerSteps(kernel, steps);
      //     } catch (error) {
      //       // eslint-disable-next-line no-console
      //       console.error(error);
      //       this.triggerSteps(kernel);
      //     }
      //   } else {
      //     this.triggerSteps();
      //   }
      // } catch (error) {
      //   // eslint-disable-next-line no-console
      //   console.error(error);
      //   this.triggerSteps();
      // }
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

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  changeSourceCode: sourceCode => dispatch(changeSourceCode(sourceCode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
