import React from "react";
import { Menu, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { next, previous } from "../../state/runtime";

export const RuntimeMenu = props => {
  const actions = [
    {
      key: "step backward",
      icon: "step backward",
      disabled: !props.hasPreviousStep,
      onClick: props.onPrevious,
    },
    { key: "play", icon: "play", disabled: true },
    { key: "pause", icon: "pause", disabled: true },
    {
      key: "step forward",
      icon: "step forward",
      disabled: !props.hasNextStep,
      onClick: props.onNext,
    },
  ];
  return (
    <Menu borderless size="tiny" attached="top">
      <Menu.Item icon="settings" header content="Runtime" />
      <Menu.Item position="right">
        <Button.Group icon compact buttons={actions} />
      </Menu.Item>
    </Menu>
  );
};

const mapStateToProps = state => ({
  hasNextStep:
    state.getIn(["runtime", "currentStep"]) <
    state.getIn(["runtime", "steps"]).size - 1,
  hasPreviousStep: state.getIn(["runtime", "currentStep"]) > 0,
});

const mapDispatchToProps = dispatch => ({
  onNext: () => dispatch(next()),
  onPrevious: () => dispatch(previous()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RuntimeMenu);
