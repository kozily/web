import React from "react";
import {
  Icon,
  Menu,
  Button,
  Divider,
  Segment,
  Sidebar,
} from "semantic-ui-react";
import Editor from "./editor";
import Errors from "./errors";
import { debugCode } from "../state/debug";
import { connect } from "react-redux";

export const IDE = props => {
  return (
    <Sidebar.Pushable>
      <Sidebar.Pusher>
        <Menu borderless size="small" color="grey" fluid>
          <Menu.Item>
            <Icon name="list ol" />Code
          </Menu.Item>
          <Menu.Item position="right">
            <Button icon labelPosition="left" onClick={props.debugCode}>
              <Icon name="bug" />Debug
            </Button>
          </Menu.Item>
        </Menu>
        <Segment>
          <Editor />
        </Segment>
      </Sidebar.Pusher>
      <Sidebar as={Menu} animation="overlay" direction="bottom" visible>
        <Divider horizontal />
        <Errors />
      </Sidebar>
    </Sidebar.Pushable>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  debugCode: () => dispatch(debugCode()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IDE);
