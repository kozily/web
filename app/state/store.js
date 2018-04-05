import { createStore } from "redux";
import { combineReducers } from "redux-immutable";
import { reducer as parse } from "./parse";
import { reducer as debug } from "./debug";

const globalReducer = combineReducers({
  parse,
  debug,
});

export default createStore(
  globalReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
