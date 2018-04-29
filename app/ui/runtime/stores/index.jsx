import React from "react";
import { Segment, Header, Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import Sigma from "./sigma";
import Tau from "./tau";
import Mu from "./mu";

export const RuntimeStores = props => {
  const sigma = props.machineState.get("sigma");
  const tau = props.machineState.get("tau");
  const mu = props.machineState.get("mu");

  return (
    <Segment attached padded>
      <Header content="Stores" />
      <Grid columns="equal" stackable>
        <Grid.Column>
          <Sigma
            store={sigma}
            showSystemVariables={props.showSystemVariables}
          />
        </Grid.Column>
        <Grid.Column>
          <Tau store={tau} />
        </Grid.Column>
        <Grid.Column>
          <Mu store={mu} />
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
  showSystemVariables: state.getIn(["runtime", "showSystemVariables"]),
});

export default connect(mapStateToProps)(RuntimeStores);
