import React from "react";
import { Message } from "semantic-ui-react";
import { connect } from "react-redux";

export const Errors = props => {
  const errorMessages = props.errors.map(e => e.get("message"));
  return (
    <Message
      hidden={props.errors.isEmpty()}
      attached="bottom"
      size="tiny"
      error
      icon="warning sign"
      header="Syntax errors"
      list={errorMessages.toJS()}
    />
  );
};

const mapStateToProps = state => ({
  errors: state.getIn(["parse", "errors"]),
});

export default connect(mapStateToProps)(Errors);
