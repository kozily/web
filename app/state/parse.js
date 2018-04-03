import Immutable from "immutable";
import parser from "../oz/parser";

export const initialState = Immutable.fromJS({
  errors: [],
});

// payload should be a string of the new source code
export const changeSourceCode = payload => {
  return {
    type: "CHANGE_SOURCE_CODE",
    payload,
  };
};

export const reducer = (previousState = initialState, action) => {
  switch (action.type) {
    case "CHANGE_SOURCE_CODE": {
      try {
        parser(action.payload);
        return previousState.set("errors", Immutable.List());
      } catch (error) {
        const errors = Immutable.fromJS([
          {
            header: "Some error",
            description: error.message,
          },
        ]);
        return previousState.set("errors", errors);
      }
    }
    default: {
      return previousState;
    }
  }
};
