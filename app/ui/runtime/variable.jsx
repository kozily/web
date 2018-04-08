import React from "react";

export const RuntimeStacksVariable = ({ variable }) => {
  return (
    <span>
      {variable.get("name")}
      <sub>{variable.get("sequence")}</sub>
    </span>
  );
};

export default RuntimeStacksVariable;
