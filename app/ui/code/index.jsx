import React from "react";
import { Segment, Grid, Menu } from "semantic-ui-react";
import CodeMenu from "./menu";
import Editor from "./editor";
import Kernel from "./kernel";
import CodeError from "./error";

export const Code = () => {
  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <CodeMenu />
          <Segment attached>
            <Editor />
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <Menu borderless size="tiny" attached="top">
            <Menu.Item icon="list" header content="Kernel" />
          </Menu>
          <Segment attached>
            <Kernel />
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <CodeError />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Code;
