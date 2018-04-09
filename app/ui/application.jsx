import "semantic-ui-css/semantic.min.css";
import React from "react";
import NavBar from "./navbar";
import Workspace from "./workspace";
import store from "../state/store";
import { Provider } from "react-redux";

export const Application = () => {
  return (
    <Provider store={store}>
      <div>
        <NavBar />
        <Workspace />
      </div>
    </Provider>
  );
};

export default Application;
