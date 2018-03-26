import React from "react";
import { Container, Menu, Icon, Grid, Divider } from "semantic-ui-react";
import MST from "./multiple-stacks";
import Stores from "./stores";
import Controller from "./controller";

export const Debuger = () => {
  return (
    <Grid container stretched>
      <Grid.Row verticalAlign="top">
        <Container>
          <Menu borderless>
            <Menu.Item>
              <Icon name="bug" />
            </Menu.Item>
            <Menu.Item>Debug Panel</Menu.Item>
          </Menu>
        </Container>
        <MST />
        <Divider horizontal />
        <Stores />
      </Grid.Row>
      <Grid.Row verticalAlign="bottom">
        <Container>
          <Controller />
        </Container>
      </Grid.Row>
    </Grid>
  );
};

export default Debuger;
