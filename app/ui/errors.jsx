import React from "react";
import { Container, Segment, Label, Icon, Message } from "semantic-ui-react";
import { connect } from "react-redux";

export const Errors = props => {
  return (
    <Container>
      <Segment padded>
        <Label attached="top">
          <Icon name="warning sign" /> Errors
        </Label>
        {props.errors.map(error => (
          <Message negative key={error.description}>
            <Message.Header>{error.header}</Message.Header>
            <p>{error.description}</p>
          </Message>
        ))}
      </Segment>
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    errors: state.getIn(["parse", "errors"]).toJS(),
  };
};

export default connect(mapStateToProps)(Errors);
