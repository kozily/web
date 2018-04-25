import React from "react";
import { Message, Segment } from "semantic-ui-react";
import { connect } from "react-redux";
import { print } from "../../oz/print";

export const RuntimeErrors = props => {
  return (
    <Segment attached padded>
      <Message
        as="pre"
        hidden={!props.error}
        attached="bottom"
        size="tiny"
        icon="warning sign"
        header="Uncaught exception when running the last statement"
        content={
          props.error
            ? `Exception value: ${print(props.error.get("error")).full}`
            : false
        }
        error
      />
    </Segment>
  );
};

const mapStateToProps = state => ({
  error: state.getIn(["runtime", "error"]),
});

export default connect(mapStateToProps)(RuntimeErrors);
