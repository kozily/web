import React from "react";
import Code from "./code";
import Runtime from "./runtime";
import { Grid, Container } from "semantic-ui-react";
import { connect } from "react-redux";

export const Workspace = props => {
  return (
    <Container fluid>
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            {props.activeItem === "code" ? <Code /> : <Runtime />}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

const mapStateToProps = state => ({
  activeItem: state.getIn(["tabs", "activeItem"]),
});

export default connect(mapStateToProps)(Workspace);
