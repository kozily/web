import React from "react";
import { Segment, Grid, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import Threads from "./threads";
import { threadStatus } from "../../../oz/machine/build";

const threadsWithStatus = (threads, status) =>
  threads.filter(t => t.getIn(["metadata", "status"]) === status);

export const RuntimeStacks = props => {
  const threads = props.machineState
    .get("threads")
    .map((thread, index) =>
      thread.set("name", `Stack ${index}`).set("index", index),
    );

  return (
    <Segment attached padded>
      <Header textAlign="left" content="Stacks" />
      <Grid divided columns="equal">
        <Grid.Column>
          <Threads
            title="Ready"
            icon="check circle"
            threads={threadsWithStatus(threads, threadStatus.ready)}
          />
        </Grid.Column>
        <Grid.Column>
          <Threads
            title="Blocked"
            icon="remove circle"
            threads={threadsWithStatus(threads, threadStatus.blocked)}
          />
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

export default connect(mapStateToProps)(RuntimeStacks);
