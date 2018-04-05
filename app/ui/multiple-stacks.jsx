import React from "react";
import { Header, Container, Grid } from "semantic-ui-react";
import Stack from "./stack";
import "./multiple-stacks.css";
import { connect } from "react-redux";

export const MST = props => {
  const colors = {
    ready: "green",
    blocked: "red",
  };
  const currentStep = 0;

  const stackList = status => {
    return (
      <Grid.Column width={6} className="mst-overflow">
        <Header as="h4" textAlign="center">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Header>
        <Grid divided="vertically">
          <Grid.Row>
            {step(currentStep, status).map((thread, index) => (
              <Grid.Column key={index} width={8}>
                <Stack
                  container={thread}
                  color={colors[status]}
                  name={"ST" + index}
                />
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  };

  const step = (stepNumber, status) =>
    props.debug.steps
      .filter((state, step) => step == stepNumber)
      .reduce((result, item) => result.concat(item.threads), [])
      .filter(z => z.metadata.status === status);

  return (
    <Container>
      <Grid celled>
        <Grid.Row className="mst-height">
          <Grid.Column width={4}>
            <Header as="h4" textAlign="center">
              Current
            </Header>
            <Stack
              container={step(currentStep, "current").map(x => x.stack)}
              name={step(currentStep, "current").map((x, i) => "ST" + i)[0]}
            />
          </Grid.Column>
          {stackList("ready")}
          {stackList("blocked")}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

const mapStateToProps = state => ({ debug: state.get("debug").toJS() });

export default connect(mapStateToProps)(MST);
