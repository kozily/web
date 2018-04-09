import Immutable from "immutable";
import parser from "../oz/parser";

export const initialState = Immutable.fromJS({
  errors: [],
  ast: null,
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
        const ast = parser(action.payload);
        return previousState.set("errors", Immutable.List()).set("ast", ast);
      } catch (error) {
        const errors = Immutable.fromJS([
          { message: error.message, offset: error.offset },
        ]);
        return previousState.set("errors", errors);
      }
    }
    default: {
      return previousState;
    }
  }
};
