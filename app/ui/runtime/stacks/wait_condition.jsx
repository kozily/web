import React from "react";
import Variable from "../variable";

export const RuntimeStacksWaitCondition = ({ waitCondition }) => {
  return (
    <span>
      Waiting for <Variable variable={waitCondition} />
    </span>
  );
};

export default RuntimeStacksWaitCondition;
