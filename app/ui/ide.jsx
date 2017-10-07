import React from "react";
import JSONTree from "react-json-tree";
import Icon from "./icons";
import Editor from "./editor";

export default class IDE extends React.Component {
  constructor(props) {
    super(props);
    this.handleSteps = this.handleSteps.bind(this);
    this.state = {
      execution: [],
      kernel: [],
    };
    this.theme = {
      scheme: "tomorrow",
      author: "chris kempson (http://chriskempson.com)",
      base00: "#1d1f21",
      base01: "#282a2e",
      base02: "#373b41",
      base03: "#969896",
      base04: "#b4b7b4",
      base05: "#c5c8c6",
      base06: "#e0e0e0",
      base07: "#ffffff",
      base08: "#cc6666",
      base09: "#de935f",
      base0A: "#f0c674",
      base0B: "#b5bd68",
      base0C: "#8abeb7",
      base0D: "#81a2be",
      base0E: "#b294bb",
      base0F: "#a3685a",
    };
  }

  handleSteps(steps) {
    this.setState(steps);
  }

  renderEditor() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <Icon icon="list-ol" /> Code
        </div>
        <div className="panel-body">
          <Editor onSteps={this.handleSteps} />
        </div>
      </div>
    );
  }

  renderTreeView(icon, name, what) {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <Icon icon={icon} /> {name}
        </div>
        <div className="panel-body">
          <JSONTree
            theme={this.theme}
            hideRoot
            data={what}
            shouldExpandNode={() => true}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            {this.renderEditor()}
            {this.renderTreeView("cube", "Kernel", this.state.kernel)}
          </div>

          <div className="col-md-6">
            {this.renderTreeView("cogs", "Execution", this.state.execution)}
          </div>
        </div>
      </div>
    );
  }
}
