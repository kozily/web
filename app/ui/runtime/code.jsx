import React from "react";

export const RuntimeCode = props => {
  return <span style={{ fontFamily: "monospace" }}>{props.children}</span>;
};

export default RuntimeCode;
