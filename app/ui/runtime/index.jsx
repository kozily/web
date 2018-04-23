import React from "react";
import Menu from "./menu";
import Stacks from "./stacks";
import Stores from "./stores";
import RuntimeError from "./error";

export const Runtime = () => {
  return (
    <div>
      <Menu />
      <Stacks />
      <Stores />
      <RuntimeError />
    </div>
  );
};

export default Runtime;
