import { combineReducers } from "redux-immutable";
import { reducer as parse } from "./parse";
import { reducer as runtime } from "./runtime";
import { reducer as tabs } from "./tabs";

export default combineReducers({
  parse,
  runtime,
  tabs,
});
