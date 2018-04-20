import React from "react";
import { Menu, Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import { onActiveTabChange } from "../state/tabs";

export const NavBar = props => {
  return (
    <Menu attached borderless fluid size="small" pointing>
      <Menu.Item header icon="home" content="Kozily" />
      <Divider />
      <Menu.Item
        header
        icon="list"
        content="code"
        name="code"
        active={props.activeItem === "code"}
        onClick={() => props.onActiveTabChange("code")}
      />
      <Menu.Item
        header
        icon="setting"
        content="runtime"
        name="runtime"
        active={props.activeItem === "runtime"}
        disabled={!props.hasMachine}
        onClick={() => props.onActiveTabChange("runtime")}
      />
    </Menu>
  );
};

const mapStateToProps = state => ({
  activeItem: state.getIn(["tabs", "activeItem"]),
  hasMachine: !state.getIn(["runtime", "steps", 0, "threads"]).isEmpty(),
});

const mapDispatchToProps = dispatch => ({
  onActiveTabChange: item => dispatch(onActiveTabChange(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
