import { createStore } from "redux";
import reducer from "./global";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;

if (module.hot) {
  module.hot.accept("./global", () => store.replaceReducer(reducer));
}
