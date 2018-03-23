import React from "react";
import Ide from "./ide";
import Debuger from "./debuger";
import { Grid, Container } from "semantic-ui-react";

export const Overview = () => {
  return (
    <Container fluid>
      <Grid celled>
        <Grid.Row>
          <Grid.Column width={4}>
            <Ide />
          </Grid.Column>
          <Grid.Column width={12}>
            <Debuger />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Overview;
