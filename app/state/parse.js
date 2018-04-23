import Immutable from "immutable";
import parser from "../oz/parser";
import { compile } from "../oz/compilation";
import { collectFreeIdentifiers } from "../oz/free_identifiers";

export const initialState = Immutable.fromJS({
  error: [],
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
        const compilation = compile(ast);
        const freeIdentifiers = collectFreeIdentifiers(compilation);
        if (!freeIdentifiers.isEmpty()) {
          throw new Error(
            `Undeclared identifiers ${freeIdentifiers.join(", ")}`,
          );
        }
        return initialState
          .set("error", Immutable.List())
          .set("ast", ast)
          .set("compiled", compilation);
      } catch (error) {
        const errorModel = Immutable.fromJS([
          { message: error.message, offset: error.offset },
        ]);
        return initialState.set("error", errorModel);
      }
    }
    default: {
      return previousState;
    }
  }
};
