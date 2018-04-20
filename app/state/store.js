import { createStore } from "redux";
import { combineReducers } from "redux-immutable";
import { reducer as parse } from "./parse";
import { reducer as runtime } from "./runtime";
import { reducer as tabs } from "./tabs";

const globalReducer = combineReducers({
  parse,
  runtime,
  tabs,
});

export default createStore(
  globalReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
