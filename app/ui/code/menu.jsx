import React from "react";
import { Menu, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { run } from "../../state/runtime";

export const CodeMenu = props => {
  return (
    <Menu borderless size="tiny" attached="top">
      <Menu.Item icon="list" header content="Code" />
      <Menu.Item position="right">
        <Button
          icon="play"
          content="Run"
          disabled={!props.canRun}
          onClick={props.onRun}
        />
      </Menu.Item>
    </Menu>
  );
};

const mapStateToProps = state => ({
  canRun: !!state.getIn(["parse", "ast"]),
});

const mapDispatchToProps = dispatch => ({
  onRun: () => dispatch(run()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CodeMenu);
