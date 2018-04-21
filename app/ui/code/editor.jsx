import React from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/oz/oz";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/elegant.css";
import "codemirror/addon/selection/active-line";
import { connect } from "react-redux";
import { changeSourceCode } from "../../state/parse";

export class CodeEditor extends React.Component {
  componentDidMount() {
    const codeMirrorOptions = {
      mode: "oz",
      theme: "elegant",
      tabSize: 2,
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      styleActiveLine: true,
      value: this.props.source,
    };
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

const mapStateToProps = state => ({
  source: state.getIn(["runtime", "source"]),
});

const mapDispatchToProps = dispatch => ({
  changeSourceCode: sourceCode => dispatch(changeSourceCode(sourceCode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);
