import React from "react";
import { Segment, Header, Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import Sigma from "./sigma";
import Tau from "./tau";

export const RuntimeStores = props => {
  const sigma = props.machineState.get("sigma");
  const tau = props.machineState.get("tau");

  return (
    <Segment attached padded>
      <Header content="Stores" />
      <Grid columns="equal">
        <Grid.Column>
          <Sigma store={sigma} />
        </Grid.Column>
        <Grid.Column>
          <Tau store={tau} />
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

const mapStateToProps = state => ({
  machineState: state.getIn([
    "runtime",
    "steps",
    state.getIn(["runtime", "currentStep"]),
  ]),
});

export default connect(mapStateToProps)(RuntimeStores);
