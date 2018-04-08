import React from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/oz/oz";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-light.css";
import "codemirror/addon/selection/active-line";
import { connect } from "react-redux";
import { changeSourceCode } from "../../state/parse";

const codeMirrorOptions = {
  mode: "oz",
  theme: "base16-light",
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: true,
  autofocus: true,
  styleActiveLine: true,
};

export class CodeEditor extends React.Component {
  componentDidMount() {
    this.editor = new CodeMirror(this.editorElement, codeMirrorOptions);
    this.editor.on("change", () => {
      const input = this.editor.getValue();
      this.props.changeSourceCode(input);
    });
    setTimeout(() => this.editor.refresh(), 1000);
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

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);
