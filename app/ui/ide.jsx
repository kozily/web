import React from "react";
import {
  Icon,
  Menu,
  Container,
  Button,
  Divider,
  Segment,
} from "semantic-ui-react";
import Editor from "./editor";
import Errors from "./errors";

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

  render() {
    return (
      <Container fluid>
        <Menu borderless size="small" color="grey" fluid>
          <Menu.Item>
            <Icon name="list ol" />Code
          </Menu.Item>
          <Menu.Item position="right">
            <Button icon labelPosition="left">
              <Icon name="bug" /> Debug
            </Button>
          </Menu.Item>
        </Menu>
        <Segment>
          <Editor onSteps={this.handleSteps} />
        </Segment>
        <Divider horizontal />
        <Errors />
      </Container>
    );
  }
}
