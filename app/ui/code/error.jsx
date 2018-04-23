import React from "react";
import { Message } from "semantic-ui-react";
import { connect } from "react-redux";

export const CodeError = props => {
  return (
    <Message
      as="pre"
      hidden={props.error === undefined}
      attached="bottom"
      size="tiny"
      error
      icon="warning sign"
      header="Syntax error"
      content={props.error !== undefined ? props.error.get("message") : false}
    />
  );
};

const mapStateToProps = state => ({
  error: state.getIn(["parse", "error"]),
});

export default connect(mapStateToProps)(CodeError);
