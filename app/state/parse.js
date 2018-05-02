import Immutable from "immutable";
import parser from "../oz/parser";
import { compile } from "../oz/compilation";
import { collectFreeIdentifiers } from "../oz/free_identifiers";
import {
  defaultEnvironment,
  resetAuxiliaryIdentifierIndex,
} from "../oz/machine/build";

const defaultIdentifiers = Immutable.Set(defaultEnvironment().keySeq());

export const initialState = Immutable.fromJS({
  error: undefined,
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
        resetAuxiliaryIdentifierIndex();
        const ast = parser(action.payload);
        const compilation = compile(ast);
        const freeIdentifiers = collectFreeIdentifiers(compilation).subtract(
          defaultIdentifiers,
        );
        if (!freeIdentifiers.isEmpty()) {
          throw new Error(
            `Undeclared identifiers ${freeIdentifiers.join(", ")}`,
          );
        }
        return initialState.set("ast", ast).set("compiled", compilation);
      } catch (error) {
        const errorModel = Immutable.fromJS({
          message: error.message,
          offset: error.offset,
        });
        return initialState.set("error", errorModel);
      }
    }
    default: {
      return previousState;
    }
  }
};
