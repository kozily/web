import React from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/oz/oz";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-light.css";
import "codemirror/addon/selection/active-line";
import { connect } from "react-redux";
import { print } from "../../oz/print";

export class KernelEditor extends React.Component {
  componentDidMount() {
    const codeMirrorOptions = {
      mode: "oz",
      theme: "base16-light",
      tabSize: 2,
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      styleActiveLine: true,
      readOnly: true,
      value: this.props.source,
    };
    this.editor = new CodeMirror(this.editorElement, codeMirrorOptions);
    setTimeout(() => this.editor.refresh(), 1000);
  }

  componentWillReceiveProps(nextProps) {
    this.editor.setValue(nextProps.source);
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
  source: print(state.getIn(["parse", "compiled"])).full,
});

export default connect(mapStateToProps)(KernelEditor);
