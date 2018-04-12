import React from "react";
import { Header, Grid } from "semantic-ui-react";
import Thread from "./thread";

export const RuntimeStacksThreads = props => {
  return (
    <div>
      <Header size="tiny" textAlign="center">
        {props.title}
      </Header>
      <Grid columns="2">
        {props.threads.map(thread => (
          <Grid.Column key={thread.get("name")}>
            <Thread thread={thread} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
};

export default RuntimeStacksThreads;
