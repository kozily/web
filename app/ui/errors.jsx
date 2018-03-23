import React from "react";
import { Container, Segment, Label, Icon, Message } from "semantic-ui-react";

export const Errors = () => {
  const errors = [
    {
      header: "Error: invalid syntax at line 1 col 7",
      description: 'local 3 in\n     ^\nUnexpected "3"',
    },
    {
      header: "Error: another error",
      description: "Variable must be capitalized",
    },
  ];
  return (
    <Container>
      <Segment padded>
        <Label attached="top">
          <Icon name="warning sign" /> Errors
        </Label>
        {errors.map(error => (
          <Message negative key={error.description}>
            <Message.Header>{error.header}</Message.Header>
            <p>{error.description}</p>
          </Message>
        ))}
      </Segment>
    </Container>
  );
};

export default Errors;
