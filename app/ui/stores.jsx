import React from "react";
import { Grid } from "semantic-ui-react";
import Store from "./store";

export const Stores = () => {
  return (
    <Grid centered relaxed>
      <Grid.Row>
        <Grid.Column width={5}>
          <Store name="sigma (o)" activeItem="full" />
        </Grid.Column>
        <Grid.Column width={5}>
          <Store name="mu (u)" activeItem="full" />
        </Grid.Column>
        <Grid.Column width={5}>
          <Store name="tau (t)" activeItem="full" />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Stores;
