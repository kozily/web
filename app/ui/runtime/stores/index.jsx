import React from "react";
import { Segment, Header, Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import Sigma from "./sigma";

export const RuntimeStores = props => {
  const sigma = props.machineState.get("sigma");

  return (
    <Segment attached padded>
      <Header content="Stores" />
      <Grid columns={3}>
        <Grid.Column>
          <Sigma title="Immutable" store={sigma} />
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
