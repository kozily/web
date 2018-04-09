import React from "react";
import { Form, Grid, Button } from "semantic-ui-react";

export const Controller = () => {
  return (
    <Grid columns={2}>
      <Grid.Column width={3}>
        <Button.Group>
          <Button icon="play" />
          <Button icon="stop circle" />
          <Button icon="chevron left" />
          <Button icon="chevron right" />
        </Button.Group>
      </Grid.Column>
      <Grid.Column width={13} as={Form}>
        <Form.Input min={100} max={5000} step={100} type="range" value={300} />
      </Grid.Column>
    </Grid>
  );
};

export default Controller;
