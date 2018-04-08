import React from "react";
import Code from "./code";
import Runtime from "./runtime";
import { Grid, Container } from "semantic-ui-react";

export const Workspace = () => {
  return (
    <Container fluid>
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={4}>
            <Code />
          </Grid.Column>
          <Grid.Column width={12}>
            <Runtime />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Workspace;
