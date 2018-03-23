import React from "react";
import { Header, Container, Grid } from "semantic-ui-react";
import Stack from "./stack";
import "./multiple-stacks.css";

export const MST = () => {
  const mst = [
    {
      stack: ["X=10...", "Z=5...", "local Y in...", "Y=5"],
      metadata: { name: "ST 3", status: "current" },
    },
    {
      stack: ["local X, Y, Z in...", "X=10", "Z=5", "local Y in...", "Y=5"],
      metadata: { name: "ST 2", status: "ready" },
    },
    {
      stack: ["local X, Y, Z in...", "X=10", "Z=5", "local Y in...", "Y=5"],
      metadata: { name: "ST 4", status: "ready" },
    },
    {
      stack: ["case X of pers...", "Age=33", 'Name="mati"'],
      metadata: { name: "ST 5", status: "blocked" },
    },
    {
      stack: ["if X then...", "V=100"],
      metadata: { name: "ST 4", status: "blocked" },
    },
    {
      stack: ["if X then...", "V=100"],
      metadata: { name: "ST 6", status: "blocked" },
    },
    {
      stack: ["if X then...", "V=100"],
      metadata: { name: "ST 7", status: "blocked" },
    },
    {
      stack: ["if X then...", "V=100"],
      metadata: { name: "ST 8", status: "blocked" },
    },
    {
      stack: ["if X then...", "V=100"],
      metadata: { name: "ST 9", status: "blocked" },
    },
  ];

  const colors = {
    ready: "green",
    blocked: "red",
  };

  const stackList = status => {
    return (
      <Grid.Column width={6} className="mst-overflow">
        <Header as="h4" textAlign="center">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Header>
        <Grid divided="vertically">
          <Grid.Row>
            {mst
              .filter(s => s.metadata.status == status)
              .map((container, index) => (
                <Grid.Column key={index} width={8}>
                  <Stack container={container} color={colors[status]} />
                </Grid.Column>
              ))}
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  };

  return (
    <Container>
      <Grid celled>
        <Grid.Row className="mst-height">
          <Grid.Column width={4}>
            <Header as="h4" textAlign="center">
              Current
            </Header>
            <Stack
              container={mst.filter(s => s.metadata.status == "current")[0]}
            />
          </Grid.Column>
          {stackList("ready")}
          {stackList("blocked")}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default MST;
