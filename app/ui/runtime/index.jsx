import React from "react";
import Menu from "./menu";
import Stacks from "./stacks";
import Stores from "./stores";

export const Runtime = () => {
  return (
    <div>
      <Menu />
      <Stacks />
      <Stores />
    </div>
  );
};

export default Runtime;
