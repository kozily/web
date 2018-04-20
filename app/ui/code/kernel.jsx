import React from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/oz/oz";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/elegant.css";
import { connect } from "react-redux";
import { print } from "../../oz/print";

export class Kernel extends React.Component {
  componentDidMount() {
    const codeMirrorOptions = {
      mode: "oz",
      theme: "elegant",
      tabSize: 2,
      lineNumbers: true,
      lineWrapping: true,
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

export default connect(mapStateToProps)(Kernel);
