import React from "react";
import { Segment, Grid, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import Threads from "./threads";

const threadsWithStatus = (threads, status) =>
  threads.filter(t => t.getIn(["metadata", "status"]) === status);

export const RuntimeStacks = props => {
  const threads = props.machineState
    .get("threads")
    .map((thread, index) => thread.set("name", `Stack ${index}`));

  return (
    <Segment attached padded>
      <Header content="Stacks" />
      <Grid divided columns="equal">
        <Grid.Column>
          <Threads
            title="Ready"
            color="green"
            icon="check circle"
            threads={threadsWithStatus(threads, "ready")}
          />
        </Grid.Column>
        <Grid.Column>
          <Threads
            title="Blocked"
            color="red"
            icon="remove circle"
            threads={threadsWithStatus(threads, "blocked")}
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
