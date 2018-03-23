import React from "react";
import NavBar from "./navbar";
import Overview from "./overview";
import "semantic-ui-css/semantic.min.css";

export const Application = () => {
  return (
    <div>
      <NavBar />
      <Overview />
    </div>
  );
};

export default Application;
