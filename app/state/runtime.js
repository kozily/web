import Immutable from "immutable";
import parser from "../oz/parser";
import { compile } from "../oz/compilation";
import { buildState, buildFromKernelAST } from "../oz/machine/build";
import { executeSingleStep } from "../oz/runtime";

export const initialState = Immutable.fromJS({
  source: "",
  steps: [buildState()],
  currentStep: 0,
  showSigmaSystemVariables: false,
});

export const run = () => {
  return {
    type: "RUNTIME_RUN",
  };
};

export const next = payload => {
  return {
    type: "RUNTIME_NEXT",
    payload,
  };
};

export const first = () => {
  return {
    type: "RUNTIME_FIRST",
  };
};

export const previous = () => {
  return {
    type: "RUNTIME_PREVIOUS",
  };
};

export const toggleShowSigmaSystemVariables = () => {
  return {
    type: "RUNTIME_TOGGLE_SHOW_SIGMA_SYSTEM_VARIABLES",
  };
};

export const reducer = (previousState = initialState, action) => {
  switch (action.type) {
    case "RUNTIME_RUN": {
      const ast = parser(previousState.get("source"));
      const kernel = compile(ast);
      const runtime = buildFromKernelAST(kernel);
      const step = executeSingleStep(runtime);
      return previousState
        .set("steps", Immutable.List([step]))
        .set("currentStep", 0);
    }
    case "RUNTIME_NEXT": {
      const threadIndex = action.payload;
      const currentStep = previousState.get("currentStep");
      const runtime = previousState.getIn(["steps", currentStep]);
      const step = executeSingleStep(runtime, { threadIndex });
      return previousState
        .update("steps", steps => steps.push(step))
        .set("currentStep", currentStep + 1);
    }
    case "RUNTIME_PREVIOUS": {
      const currentStep = previousState.get("currentStep");
      const previousStep = currentStep > 0 ? currentStep - 1 : currentStep;
      return previousState
        .update("steps", steps => steps.pop())
        .set("currentStep", previousStep);
    }
    case "RUNTIME_FIRST": {
      return previousState
        .update("steps", steps => Immutable.List([steps.get(0)]))
        .set("currentStep", 0);
    }
    case "CHANGE_SOURCE_CODE": {
      return previousState.set("source", action.payload);
    }
    case "RUNTIME_TOGGLE_SHOW_SIGMA_SYSTEM_VARIABLES": {
      return previousState.update("showSigmaSystemVariables", value => !value);
    }
    default: {
      return previousState;
    }
  }
};
