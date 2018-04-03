import React from "react";
import NavBar from "./navbar";
import Overview from "./overview";
import "semantic-ui-css/semantic.min.css";
import store from "../state/store";
import { Provider } from "react-redux";

export const Application = () => {
  return (
    <Provider store={store}>
      <div>
        <NavBar />
        <Overview />
      </div>
    </Provider>
  );
};

export default Application;
