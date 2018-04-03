import { createStore } from "redux";
import { combineReducers } from "redux-immutable";
import { reducer as parse } from "./parse";

const globalReducer = combineReducers({
  parse,
});

export default createStore(
  globalReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
