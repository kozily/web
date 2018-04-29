import React from "react";
import { Dropdown, Menu, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { first, previous } from "../../state/runtime";
import { toggleShowSystemVariables } from "../../state/runtime";

export const RuntimeMenu = props => {
  const showHide = props.showSystemVariables ? "Hide" : "Show";
  const showHideMessage = `${showHide} system variables`;
  const actions = [
    {
      key: "fast backward",
      icon: "fast backward",
      disabled: !props.hasPreviousStep,
      onClick: props.onFirst,
    },
    {
      key: "step backward",
      icon: "step backward",
      disabled: !props.hasPreviousStep,
      onClick: props.onPrevious,
    },
  ];
  return (
    <Menu borderless size="tiny" attached="top">
      <Menu.Item icon="settings" header content="Runtime" />
      <Menu.Menu position="right">
        <Button.Group icon compact buttons={actions} />
        <Dropdown item icon="ellipsis vertical">
          <Dropdown.Menu>
            <Dropdown.Item
              content={showHideMessage}
              onClick={props.onToggleShowSystemVariables}
            />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  );
};

const mapStateToProps = state => ({
  hasNextStep:
    state.getIn(["runtime", "currentStep"]) <
    state.getIn(["runtime", "steps"]).size - 1,
  hasPreviousStep: state.getIn(["runtime", "currentStep"]) > 0,
  showSystemVariables: state.getIn(["runtime", "showSystemVariables"]),
});

const mapDispatchToProps = dispatch => ({
  onPrevious: () => dispatch(previous()),
  onFirst: () => dispatch(first()),
  onToggleShowSystemVariables: () => dispatch(toggleShowSystemVariables()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RuntimeMenu);
