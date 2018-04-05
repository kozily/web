import React from "react";
import { Grid } from "semantic-ui-react";
import Store from "./store";
import { connect } from "react-redux";

export const Stores = props => {
  const currentStep = 0;

  const step = stepNumber =>
    props.debug.steps.filter((state, step) => step == stepNumber);

  return (
    <Grid centered relaxed>
      <Grid.Row>
        <Grid.Column width={5}>
          <Store
            name="sigma (o)"
            data={step(currentStep).map(s => s.sigma)}
            activeItem="full"
          />
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

const mapStateToProps = state => ({ debug: state.get("debug").toJS() });

export default connect(mapStateToProps)(Stores);
