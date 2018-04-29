import Immutable from "immutable";
import parser from "../oz/parser";
import { compile } from "../oz/compilation";
import { buildState, buildFromKernelAST } from "../oz/machine/build";
import { executeSingleStep } from "../oz/runtime";
import { resetEnvironmentIndex } from "../oz/machine/environment";

export const initialState = Immutable.fromJS({
  source: "",
  steps: [buildState()],
  currentStep: 0,
  showSystemVariables: false,
  error: null,
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

export const toggleShowSystemVariables = () => {
  return {
    type: "RUNTIME_TOGGLE_SHOW_SYSTEM_VARIABLES",
  };
};

export const reducer = (previousState = initialState, action) => {
  switch (action.type) {
    case "RUNTIME_RUN": {
      const ast = parser(previousState.get("source"));
      const kernel = compile(ast);
      resetEnvironmentIndex();
      const runtime = buildFromKernelAST(kernel);
      return previousState
        .set("steps", Immutable.List.of(runtime))
        .set("currentStep", 0)
        .set("error", null);
    }
    case "RUNTIME_NEXT": {
      const threadIndex = action.payload;
      const currentStep = previousState.get("currentStep");
      const runtime = previousState.getIn(["steps", currentStep]);
      try {
        const step = executeSingleStep(runtime, { threadIndex });
        return previousState
          .update("steps", steps => steps.push(step))
          .set("currentStep", currentStep + 1)
          .set("error", null);
      } catch (error) {
        return previousState.set(
          "error",
          Immutable.Map({
            message: "Unhandled OZ exception",
            error: error.innerOzException,
          }),
        );
      }
    }
    case "RUNTIME_PREVIOUS": {
      const currentStep = previousState.get("currentStep");
      const previousStep = currentStep > 0 ? currentStep - 1 : currentStep;
      if (currentStep === 1) {
        resetEnvironmentIndex();
      }
      return previousState
        .update("steps", steps => steps.pop())
        .set("currentStep", previousStep)
        .set("error", null);
    }
    case "RUNTIME_FIRST": {
      resetEnvironmentIndex();
      return previousState
        .update("steps", steps => Immutable.List([steps.get(0)]))
        .set("currentStep", 0)
        .set("error", null);
    }
    case "CHANGE_SOURCE_CODE": {
      return previousState.set("source", action.payload);
    }
    case "RUNTIME_TOGGLE_SHOW_SYSTEM_VARIABLES": {
      return previousState.update("showSystemVariables", value => !value);
    }
    default: {
      return previousState;
    }
  }
};
