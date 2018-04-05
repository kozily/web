import Immutable from "immutable";
import parser from "../oz/parser";
import kernelizer from "../oz/kernelizer";
import { buildFromKernelAST } from "../oz/machine/build";
import { executeAllSteps } from "../oz/runtime";

// {
//   stack: ["if X then...", "V=100"],
//   metadata: { name: "ST 9", status: "blocked" },
// },
export const initialState = Immutable.fromJS({ codeSource: "", steps: [] });

// payload should be a string of the new source code
export const debugCode = () => {
  return {
    type: "DEBUG_CODE",
  };
};

export const reducer = (previousState = initialState, action) => {
  switch (action.type) {
    case "DEBUG_CODE": {
      const parsed = parser(previousState.get("codeSource"));
      const kernel = kernelizer(parsed);
      const runtime = buildFromKernelAST(kernel);
      const steps = executeAllSteps(runtime);
      return previousState.set("steps", steps || []);
    }
    case "CHANGE_SOURCE_CODE": {
      return previousState.set("codeSource", action.payload);
    }
    default: {
      return previousState;
    }
  }
};
