import Immutable from "immutable";
import parser from "../oz/parser";
import { compile } from "../oz/compilation";
import { buildState, buildFromKernelAST } from "../oz/machine/build";
import { executeAllSteps } from "../oz/runtime";

export const initialState = Immutable.fromJS({
  source: "",
  steps: [buildState()],
  currentStep: 0,
});

export const run = () => {
  return {
    type: "RUNTIME_RUN",
  };
};

export const next = () => {
  return {
    type: "RUNTIME_NEXT",
  };
};

export const first = () => {
  return {
    type: "RUNTIME_FIRST",
  };
};

export const last = () => {
  return {
    type: "RUNTIME_LAST",
  };
};

export const previous = () => {
  return {
    type: "RUNTIME_PREVIOUS",
  };
};

export const reducer = (previousState = initialState, action) => {
  switch (action.type) {
    case "RUNTIME_RUN": {
      const ast = parser(previousState.get("source"));
      const kernel = compile(ast);
      const runtime = buildFromKernelAST(kernel);
      const steps = executeAllSteps(runtime);
      return previousState.set("steps", steps).set("currentStep", 0);
    }
    case "RUNTIME_NEXT": {
      const currentStep = previousState.get("currentStep");
      const lastStep = previousState.get("steps").size - 1;
      const nextStep = currentStep < lastStep ? currentStep + 1 : currentStep;
      return previousState.set("currentStep", nextStep);
    }
    case "RUNTIME_PREVIOUS": {
      const currentStep = previousState.get("currentStep");
      const previousStep = currentStep > 0 ? currentStep - 1 : currentStep;
      return previousState.set("currentStep", previousStep);
    }
    case "RUNTIME_FIRST": {
      return previousState.set("currentStep", 0);
    }
    case "RUNTIME_LAST": {
      const lastStep = previousState.get("steps").size - 1;
      return previousState.set("currentStep", lastStep);
    }
    case "CHANGE_SOURCE_CODE": {
      return previousState.set("source", action.payload);
    }
    default: {
      return previousState;
    }
  }
};
