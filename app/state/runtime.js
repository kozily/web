import Immutable from "immutable";
import parser from "../oz/parser";
import kernelizer from "../oz/kernelizer";
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

export const previous = () => {
  return {
    type: "RUNTIME_PREVIOUS",
  };
};

export const reducer = (previousState = initialState, action) => {
  switch (action.type) {
    case "RUNTIME_RUN": {
      const parsed = parser(previousState.get("source"));
      const kernel = kernelizer(parsed);
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
    case "CHANGE_SOURCE_CODE": {
      return previousState.set("source", action.payload);
    }
    default: {
      return previousState;
    }
  }
};
