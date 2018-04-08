import React from "react";
import { Segment } from "semantic-ui-react";
import Menu from "./menu";
import Editor from "./editor";
import Errors from "./errors";

export const Code = () => {
  return (
    <div>
      <Menu />
      <Segment attached>
        <Editor />
      </Segment>
      <Errors />
    </div>
  );
};

export default Code;
