import React from "react";
import { Header, Grid, Transition } from "semantic-ui-react";
import Thread from "./thread";

export const RuntimeStacksThreads = props => {
  return (
    <div>
      <Header size="tiny" textAlign="center">
        {props.title}
      </Header>
      <Transition.Group animation="fade up" as={Grid} columns="2">
        {props.threads.map(thread => (
          <Grid.Column key={thread.get("name")}>
            <Thread thread={thread} />
          </Grid.Column>
        ))}
      </Transition.Group>
    </div>
  );
};

export default RuntimeStacksThreads;
