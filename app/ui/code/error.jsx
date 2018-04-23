import React from "react";
import { Message } from "semantic-ui-react";
import { connect } from "react-redux";

export const CodeError = props => {
  const errorMessages = props.error.map(e => e.get("message"));
  return (
    <Message
      as="pre"
      hidden={props.error.isEmpty()}
      attached="bottom"
      size="tiny"
      error
      icon="warning sign"
      header="Syntax error"
      list={errorMessages.toJS()}
    />
  );
};

const mapStateToProps = state => ({
  error: state.getIn(["parse", "error"]),
});

export default connect(mapStateToProps)(CodeError);
