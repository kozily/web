import React from "react";
import { Segment, Grid, Menu } from "semantic-ui-react";
import CodeMenu from "./menu";
import Editor from "./editor";
import KernelEditor from "./kernelEditor";
import Errors from "./errors";

export const Code = () => {
  return (
    <Grid>
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
            <KernelEditor />
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Errors />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Code;
